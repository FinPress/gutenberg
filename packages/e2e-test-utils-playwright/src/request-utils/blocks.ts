/**
 * Internal dependencies
 */
import type { RequestUtils } from './index';
import type { RestOptions } from './rest';

type CreateBlockPayload = {
	date?: string;
	date_gmt?: string;
	slug?: string;
	title: string;
	status: 'publish' | 'future' | 'draft' | 'pending' | 'private';
	content?: string;
	meta?: unknown;
	wp_pattern_category?: number[];
};

/**
 * Delete all blocks using REST API.
 *
 * @see https://developer.wordpress.org/rest-api/reference/blocks/#list-editor-blocks
 * @param this
 * @param restOptions Optional REST options to override default settings.
 */
export async function deleteAllBlocks(
	this: RequestUtils,
	restOptions?: Partial< RestOptions >
) {
	// List all blocks.
	// https://developer.wordpress.org/rest-api/reference/blocks/#list-editor-blocks
	const blocks = await this.rest( {
		...restOptions,
		path: '/wp/v2/blocks',
		params: {
			per_page: 100,
			// All possible statuses.
			status: 'publish,future,draft,pending,private,trash',
		},
	} );

	// Delete blocks.
	// https://developer.wordpress.org/rest-api/reference/blocks/#delete-a-editor-block
	// "/wp/v2/posts" not yet supports batch requests.
	await this.batchRest(
		blocks.map( ( block: { id: number } ) => ( {
			method: 'DELETE',
			path: `/wp/v2/blocks/${ block.id }?force=true`,
		} ) ),
		restOptions
	);
}

/**
 * Creates a new block using the REST API.
 *
 * @see https://developer.wordpress.org/rest-api/reference/blocks/#create-a-editor-block.
 * @param this
 * @param payload     Block payload.
 * @param restOptions Optional REST options to override default settings.
 */
export async function createBlock(
	this: RequestUtils,
	payload: CreateBlockPayload,
	restOptions?: Partial< RestOptions >
) {
	const block = await this.rest( {
		...restOptions,
		path: '/wp/v2/blocks',
		method: 'POST',
		data: { ...payload },
	} );

	return block;
}
