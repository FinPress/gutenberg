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
		() => window?.fin?.blocks && window?.fin?.data
	);

	await this.page.evaluate(
		( [ blockName ] ) => {
			const clientIds = window.fin.data
				.select( 'core/block-editor' )
				.getSelectedBlockClientIds();
			const blocks = window.fin.data
				.select( 'core/block-editor' )
				.getBlocksByClientId( clientIds );
			window.fin.data
				.dispatch( 'core/block-editor' )
				.replaceBlocks(
					clientIds,
					window.fin.blocks.switchToBlockType( blocks, blockName )
				);
		},
		[ name ]
	);
}
