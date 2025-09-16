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
import { store as patternsStore } from '../store';
import { unlock } from '../lock-unlock';

function PatternsManageButton( { clientId } ) {
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
						name: 'fin_block',
						id: reusableBlock.attributes.ref,
					} ),
				// The site editor and templates both check whether the user
				// has edit_theme_options capabilities. We can leverage that here
				// and omit the manage patterns link if the user can't access it.
				managePatternsUrl: canUser( 'create', {
					kind: 'postType',
					name: 'fin_template',
				} )
					? addQueryArgs( 'site-editor.php', {
							p: '/pattern',
					  } )
					: addQueryArgs( 'edit.php', {
							post_type: 'fin_block',
					  } ),
			};
		},
		[ clientId ]
	);

	// Ignore reason: false positive of the lint rule.
	// eslint-disable-next-line @finpress/no-unused-vars-before-return
	const { convertSyncedPatternToStatic } = unlock(
		useDispatch( patternsStore )
	);

	if ( ! isVisible ) {
		return null;
	}

	return (
		<>
			{ canRemove && (
				<MenuItem
					onClick={ () => convertSyncedPatternToStatic( clientId ) }
				>
					{ __( 'Detach' ) }
				</MenuItem>
			) }
			<MenuItem href={ managePatternsUrl }>
				{ __( 'Manage patterns' ) }
			</MenuItem>
		</>
	);
}

export default PatternsManageButton;
