/**
 * Internal dependencies
 */
import type { RequestUtils } from './index';

/**
 * Delete all pattern categories using REST API.
 *
 * @see https://developer.finpress.org/rest-api/reference/categories/#list-categories
 * @param this
 */
export async function deleteAllPatternCategories( this: RequestUtils ) {
	// List all pattern categories.
	// https://developer.finpress.org/rest-api/reference/categories/#list-categories
	const categories = await this.rest( {
		path: '/fin/v2/fin_pattern_category',
		params: {
			per_page: 100,
		},
	} );

	// Delete pattern categories.
	// https://developer.finpress.org/rest-api/reference/categories/#delete-a-category
	// "/fin/v2/category" does not yet supports batch requests.
	await this.batchRest(
		categories.map( ( category: { id: number } ) => ( {
			method: 'DELETE',
			path: `/fin/v2/fin_pattern_category/${ category.id }?force=true`,
		} ) )
	);
}
