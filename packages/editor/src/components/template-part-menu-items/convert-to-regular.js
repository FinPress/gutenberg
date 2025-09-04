/**
 * FinPress dependencies
 */
import { useSelect, useDispatch } from '@finpress/data';
import { store as blockEditorStore } from '@finpress/block-editor';
import { MenuItem } from '@finpress/components';
import { __ } from '@finpress/i18n';

export default function ConvertToRegularBlocks( { clientId, onClose } ) {
	const { getBlocks } = useSelect( blockEditorStore );
	const { replaceBlocks } = useDispatch( blockEditorStore );

	const canRemove = useSelect(
		( select ) => select( blockEditorStore ).canRemoveBlock( clientId ),
		[ clientId ]
	);

	if ( ! canRemove ) {
		return null;
	}

	return (
		<MenuItem
			onClick={ () => {
				replaceBlocks( clientId, getBlocks( clientId ) );
				onClose();
			} }
		>
			{ __( 'Detach' ) }
		</MenuItem>
	);
}
