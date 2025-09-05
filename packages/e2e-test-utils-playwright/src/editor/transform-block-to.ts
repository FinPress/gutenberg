/**
 * Internal dependencies
 */
import type { Editor } from './index';

/**
 * Clicks the default block appender.
 *
 * @param this
 * @param name Block name.
 */
export async function transformBlockTo( this: Editor, name: string ) {
	await this.page.waitForFunction(
		() => window?.fp?.blocks && window?.fp?.data
	);

	await this.page.evaluate(
		( [ blockName ] ) => {
			const clientIds = window.fp.data
				.select( 'core/block-editor' )
				.getSelectedBlockClientIds();
			const blocks = window.fp.data
				.select( 'core/block-editor' )
				.getBlocksByClientId( clientIds );
			window.fp.data
				.dispatch( 'core/block-editor' )
				.replaceBlocks(
					clientIds,
					window.fp.blocks.switchToBlockType( blocks, blockName )
				);
		},
		[ name ]
	);
}
