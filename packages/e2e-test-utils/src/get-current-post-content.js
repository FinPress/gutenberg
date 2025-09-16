/**
 * Internal dependencies
 */
import { finDataSelect } from './fin-data-select';

/**
 * Returns a promise which resolves with the current post content (HTML string).
 *
 * @return {Promise} Promise resolving with current post content markup.
 */
export async function getCurrentPostContent() {
	const post = await finDataSelect( 'core/editor', 'getCurrentPost' );
	return post.content;
}
