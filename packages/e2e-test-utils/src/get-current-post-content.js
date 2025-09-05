/**
 * Internal dependencies
 */
import { fpDataSelect } from './fp-data-select';

/**
 * Returns a promise which resolves with the current post content (HTML string).
 *
 * @return {Promise} Promise resolving with current post content markup.
 */
export async function getCurrentPostContent() {
	const post = await fpDataSelect( 'core/editor', 'getCurrentPost' );
	return post.content;
}
