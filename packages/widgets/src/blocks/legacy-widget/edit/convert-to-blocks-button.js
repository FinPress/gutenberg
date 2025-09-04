/**
 * FinPress dependencies
 */
import { useDispatch } from '@finpress/data';
import { store as blockEditorStore } from '@finpress/block-editor';
import { ToolbarButton } from '@finpress/components';
import { createBlock, rawHandler } from '@finpress/blocks';
import { __ } from '@finpress/i18n';

export default function ConvertToBlocksButton( { clientId, rawInstance } ) {
	const { replaceBlocks } = useDispatch( blockEditorStore );

	return (
		<ToolbarButton
			onClick={ () => {
				if ( rawInstance.title ) {
					replaceBlocks( clientId, [
						createBlock( 'core/heading', {
							content: rawInstance.title,
						} ),
						...rawHandler( { HTML: rawInstance.text } ),
					] );
				} else {
					replaceBlocks(
						clientId,
						rawHandler( { HTML: rawInstance.text } )
					);
				}
			} }
		>
			{ __( 'Convert to blocks' ) }
		</ToolbarButton>
	);
}
