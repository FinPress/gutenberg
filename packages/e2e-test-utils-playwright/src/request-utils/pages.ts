/**
 * Internal dependencies
 */
import type { RequestUtils } from './index';
import type { RestOptions } from './rest';

const PAGE_STATUS = [
	'publish',
	'future',
	'draft',
	'pending',
	'private',
	'trash',
] as const;

export type Page = {
	id: number;
	status: ( typeof PAGE_STATUS )[ number ];
};

export type CreatePagePayload = {
	title?: string;
	content?: string;
	status: ( typeof PAGE_STATUS )[ number ];
	date?: string;
	date_gmt?: string;
};

export async function deletePage(
	this: RequestUtils,
	id: number,
	restOptions?: Partial< RestOptions >
) {
	// https://developer.wordpress.org/rest-api/reference/pages/#delete-a-page
	return await this.rest( {
		...restOptions,
		method: 'DELETE',
		path: `/wp/v2/pages/${ id }`,
		params: {
			force: true,
		},
	} );
}

/**
 * Delete all pages using REST API.
 *
 * @param this
 * @param restOptions Optional REST options to override default settings.
 */
export async function deleteAllPages(
	this: RequestUtils,
	restOptions?: Partial< RestOptions >
) {
	// List all pages.
	// https://developer.wordpress.org/rest-api/reference/pages/#list-pages
	const pages = await this.rest< Page[] >( {
		...restOptions,
		path: '/wp/v2/pages',
		params: {
			per_page: 100,

			status: PAGE_STATUS.join( ',' ),
		},
	} );

	// Delete all pages one by one.
	// "/wp/v2/pages" not yet supports batch requests.
	await Promise.all(
		pages.map( ( page ) => deletePage.call( this, page.id, restOptions ) )
	);
}

/**
 * Create a new page.
 *
 * @param this
 * @param payload     The page payload.
 * @param restOptions Optional REST options to override default settings.
 */
export async function createPage(
	this: RequestUtils,
	payload: CreatePagePayload,
	restOptions?: Partial< RestOptions >
) {
	// https://developer.wordpress.org/rest-api/reference/pages/#create-a-page
	const page = await this.rest< Page >( {
		...restOptions,
		method: 'POST',
		path: `/wp/v2/pages`,
		data: { ...payload },
	} );

	return page;
}
