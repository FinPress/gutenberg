/**
 * Internal dependencies
 */
import type { Editor } from './index';

/**
 * Switches to legacy (non-iframed) canvas.
 *
 * @param this
 */
export async function switchToLegacyCanvas( this: Editor ) {
	await this.page.waitForFunction( () => window?.fin?.blocks );

	await this.page.evaluate( () => {
		window.fin.blocks.registerBlockType( 'test/v2', {
			apiVersion: '2',
			title: 'test',
		} );
	} );
}
