/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { MenuItem } from '@wordpress/components';
import { seen, unseen } from '@wordpress/icons';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { cleanEmptyObject } from '../../hooks/utils';
import { store as blockEditorStore } from '../../store';

export default function BlockVisibilityMenuItem( { clientIds } ) {
	const { updateBlockAttributes } = useDispatch( blockEditorStore );
	const blocks = useSelect(
		( select ) => {
			return select( blockEditorStore ).getBlocksByClientId( clientIds );
		},
		[ clientIds ]
	);

	const hasHiddenBlock = blocks.some(
		( block ) => block.attributes.metadata?.blockVisibility === false
	);

	const toggleBlockVisibility = () => {
		blocks.forEach( ( block ) => {
			updateBlockAttributes( block.clientId, {
				metadata: cleanEmptyObject( {
					...block.attributes?.metadata,
					blockVisibility: hasHiddenBlock ? undefined : false,
				} ),
			} );
		} );
	};

	return (
		<MenuItem
			icon={ hasHiddenBlock ? seen : unseen }
			onClick={ toggleBlockVisibility }
		>
			{ hasHiddenBlock ? __( 'Show' ) : __( 'Hide' ) }
		</MenuItem>
	);
}
