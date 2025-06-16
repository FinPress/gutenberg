/**
 * Internal dependencies
 */
import type { RequestUtils } from './index';
import type { RestOptions } from './rest';

/**
 * Delete all pattern categories using REST API.
 *
 * @see https://developer.wordpress.org/rest-api/reference/categories/#list-categories
 * @param this
 * @param restOptions Optional REST options to override default settings.
 */
export async function deleteAllPatternCategories(
	this: RequestUtils,
	restOptions?: Partial< RestOptions >
) {
	// List all pattern categories.
	// https://developer.wordpress.org/rest-api/reference/categories/#list-categories
	const categories = await this.rest( {
		...restOptions,
		path: '/wp/v2/wp_pattern_category',
		params: {
			per_page: 100,
		},
	} );

	// Delete pattern categories.
	// https://developer.wordpress.org/rest-api/reference/categories/#delete-a-category
	// "/wp/v2/category" does not yet supports batch requests.
	await this.batchRest(
		categories.map( ( category: { id: number } ) => ( {
			method: 'DELETE',
			path: `/wp/v2/wp_pattern_category/${ category.id }?force=true`,
		} ) ),
		restOptions
	);
}
