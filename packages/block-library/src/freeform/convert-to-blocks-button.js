/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { ToolbarButton } from '@finpress/components';
import { useDispatch, useSelect } from '@finpress/data';
import { rawHandler, serialize } from '@finpress/blocks';
import { store as blockEditorStore } from '@finpress/block-editor';

const ConvertToBlocksButton = ( { clientId } ) => {
	const { replaceBlocks } = useDispatch( blockEditorStore );
	const block = useSelect(
		( select ) => {
			return select( blockEditorStore ).getBlock( clientId );
		},
		[ clientId ]
	);

	return (
		<ToolbarButton
			onClick={ () =>
				replaceBlocks(
					block.clientId,
					rawHandler( { HTML: serialize( block ) } )
				)
			}
		>
			{ __( 'Convert to blocks' ) }
		</ToolbarButton>
	);
};

export default ConvertToBlocksButton;
