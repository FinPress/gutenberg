/**
 * Internal dependencies
 */
import type { Editor } from './index';

/**
 * Set the content of the editor.
 *
 * @param this
 * @param html Serialized block HTML.
 */
async function setContent( this: Editor, html: string ) {
	await this.page.waitForFunction(
		() => window?.fin?.blocks && window?.fin?.data
	);

	await this.page.evaluate( ( _html ) => {
		const blocks = window.fin.blocks.parse( _html );

		window.fin.data.dispatch( 'core/block-editor' ).resetBlocks( blocks );
	}, html );
}

export { setContent };
