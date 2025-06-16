/**
 * Internal dependencies
 */
import type { RequestUtils } from './index';
import type { RestOptions } from './rest';

export interface Post {
	id: number;
	content: string;
	status: 'publish' | 'future' | 'draft' | 'pending' | 'private';
	link: string;
}

export interface CreatePostPayload {
	title?: string;
	content?: string;
	status: 'publish' | 'future' | 'draft' | 'pending' | 'private';
	date?: string;
	date_gmt: string;
}

/**
 * Delete all posts using REST API.
 *
 * @param this
 * @param restOptions Optional REST options to override default settings.
 */
export async function deleteAllPosts(
	this: RequestUtils,
	restOptions?: Partial< RestOptions >
) {
	// List all posts.
	// https://developer.wordpress.org/rest-api/reference/posts/#list-posts
	const posts = await this.rest< Post[] >( {
		...restOptions,
		path: '/wp/v2/posts',
		params: {
			per_page: 100,
			// All possible statuses.
			status: 'publish,future,draft,pending,private,trash',
		},
	} );

	// Delete all posts one by one.
	// https://developer.wordpress.org/rest-api/reference/posts/#delete-a-post
	// "/wp/v2/posts" not yet supports batch requests.
	await Promise.all(
		posts.map( ( post ) =>
			this.rest( {
				...restOptions,
				method: 'DELETE',
				path: `/wp/v2/posts/${ post.id }`,
				params: {
					force: true,
				},
			} )
		)
	);
}

/**
 * Creates a new post using the REST API.
 *
 * @param this
 * @param payload     Post attributes.
 * @param restOptions Optional REST options to override default settings.
 */
export async function createPost(
	this: RequestUtils,
	payload: CreatePostPayload,
	restOptions?: Partial< RestOptions >
) {
	const post = await this.rest< Post >( {
		...restOptions,
		method: 'POST',
		path: `/wp/v2/posts`,
		data: { ...payload },
	} );

	return post;
}
