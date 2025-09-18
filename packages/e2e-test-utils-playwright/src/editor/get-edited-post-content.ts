/**
 * Internal dependencies
 */
import type { Editor } from './index';

/**
 * Returns a promise which resolves with the edited post content (HTML string).
 *
 * @param this
 *
 * @return Promise resolving with post content markup.
 */
export async function getEditedPostContent( this: Editor ) {
	await this.page.waitForFunction( () => window?.fin?.data );

	return await this.page.evaluate( () =>
		window.fin.data.select( 'core/editor' ).getEditedPostContent()
	);
}
