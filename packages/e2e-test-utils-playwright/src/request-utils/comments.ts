/**
 * Internal dependencies
 */
import type { RequestUtils } from './index';
import type { RestOptions } from './rest';

export interface Comment {
	id: number;
	author: number;
	content: string;
	post: number;
}

export interface CreateCommentPayload {
	content: string;
	post: number;
}

export interface User {
	id: number;
}

/**
 * Create new comment using the REST API.
 *
 * @param this
 * @param payload
 * @param restOptions Optional REST options to override default settings.
 */
export async function createComment(
	this: RequestUtils,
	payload: CreateCommentPayload,
	restOptions?: Partial< RestOptions >
) {
	const currentUser = await this.rest< User >( {
		...restOptions,
		path: '/wp/v2/users/me',
		method: 'GET',
	} );

	const author = currentUser.id;

	const comment = await this.rest< Comment >( {
		...restOptions,
		method: 'POST',
		path: '/wp/v2/comments',
		data: { ...payload, author },
	} );

	return comment;
}

/**
 * Delete all comments using the REST API.
 *
 * @param this
 * @param restOptions Optional REST options to override default settings.
 */
export async function deleteAllComments(
	this: RequestUtils,
	restOptions?: Partial< RestOptions >
) {
	// List all comments.
	// https://developer.wordpress.org/rest-api/reference/comments/#list-comments
	const comments = await this.rest( {
		...restOptions,
		path: '/wp/v2/comments',
		params: {
			per_page: 100,
			// All possible statuses.
			status: 'unapproved,approved,spam,trash',
		},
	} );

	// Delete all comments one by one.
	// https://developer.wordpress.org/rest-api/reference/comments/#delete-a-comment
	// "/wp/v2/comments" doesn't support batch requests yet.
	await Promise.all(
		comments.map( ( comment: Comment ) =>
			this.rest( {
				...restOptions,
				method: 'DELETE',
				path: `/wp/v2/comments/${ comment.id }`,
				params: {
					force: true,
				},
			} )
		)
	);
}
