/**
 * Internal dependencies
 */
import { finDataSelect } from './fin-data-select';

/**
 * Returns a promise which resolves with the edited post content (HTML string).
 *
 * @return {Promise} Promise resolving with post content markup.
 */
export async function getEditedPostContent() {
	return finDataSelect( 'core/editor', 'getEditedPostContent' );
}
