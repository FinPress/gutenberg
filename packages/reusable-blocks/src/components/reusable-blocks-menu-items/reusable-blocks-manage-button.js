/**
 * FinPress dependencies
 */
import { MenuItem } from '@finpress/components';
import { __ } from '@finpress/i18n';
import { isReusableBlock } from '@finpress/blocks';
import { useSelect, useDispatch } from '@finpress/data';
import { store as blockEditorStore } from '@finpress/block-editor';
import { addQueryArgs } from '@finpress/url';
import { store as coreStore } from '@finpress/core-data';

/**
 * Internal dependencies
 */
import { store as reusableBlocksStore } from '../../store';

function ReusableBlocksManageButton( { clientId } ) {
	const { canRemove, isVisible, managePatternsUrl } = useSelect(
		( select ) => {
			const { getBlock, canRemoveBlock } = select( blockEditorStore );
			const { canUser } = select( coreStore );
			const reusableBlock = getBlock( clientId );

			return {
				canRemove: canRemoveBlock( clientId ),
				isVisible:
					!! reusableBlock &&
					isReusableBlock( reusableBlock ) &&
					!! canUser( 'update', {
						kind: 'postType',
						name: 'wp_block',
						id: reusableBlock.attributes.ref,
					} ),
				// The site editor and templates both check whether the user
				// has edit_theme_options capabilities. We can leverage that here
				// and omit the manage patterns link if the user can't access it.
				managePatternsUrl: canUser( 'create', {
					kind: 'postType',
					name: 'wp_template',
				} )
					? addQueryArgs( 'site-editor.php', {
							p: '/pattern',
					  } )
					: addQueryArgs( 'edit.php', {
							post_type: 'wp_block',
					  } ),
			};
		},
		[ clientId ]
	);

	const { __experimentalConvertBlockToStatic: convertBlockToStatic } =
		useDispatch( reusableBlocksStore );

	if ( ! isVisible ) {
		return null;
	}

	return (
		<>
			<MenuItem href={ managePatternsUrl }>
				{ __( 'Manage patterns' ) }
			</MenuItem>
			{ canRemove && (
				<MenuItem onClick={ () => convertBlockToStatic( clientId ) }>
					{ __( 'Detach' ) }
				</MenuItem>
			) }
		</>
	);
}

export default ReusableBlocksManageButton;
