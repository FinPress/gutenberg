/**
 * External dependencies
 */
import * as fs from 'fs';

/**
 * Internal dependencies
 */
import type { RequestUtils } from './index';
import type { RestOptions } from './rest';

export interface Media {
	id: number;
	title: {
		raw: string;
		rendered: string;
	};
	source_url: string;
	slug: string;
	alt_text: string;
	caption: { rendered: string };
	link: string;
}

/**
 * List all media files.
 *
 * @see https://developer.wordpress.org/rest-api/reference/media/#list-media
 * @param this
 * @param restOptions Optional REST options to override default settings.
 */
async function listMedia(
	this: RequestUtils,
	restOptions?: Partial< RestOptions >
) {
	const response = await this.rest< Media[] >( {
		...restOptions,
		method: 'GET',
		path: '/wp/v2/media',
		params: {
			per_page: 100,
		},
	} );

	return response;
}

/**
 * Upload a media file.
 *
 * @see https://developer.wordpress.org/rest-api/reference/media/#create-a-media-item
 * @param this
 * @param filePathOrData The path or data of the file being uploaded.
 * @param restOptions    Optional REST options to override default settings.
 */
async function uploadMedia(
	this: RequestUtils,
	filePathOrData: string | fs.ReadStream,
	restOptions?: Partial< RestOptions >
) {
	const file =
		typeof filePathOrData === 'string'
			? fs.createReadStream( filePathOrData )
			: filePathOrData;

	const response = await this.rest< Media >( {
		...restOptions,
		method: 'POST',
		path: '/wp/v2/media',
		multipart: {
			file,
		},
	} );

	return response;
}

/**
 * delete a media file.
 *
 * @see https://developer.wordpress.org/rest-api/reference/media/#delete-a-media-item
 * @param this
 * @param mediaId     The ID of the media file.
 * @param restOptions Optional REST options to override default settings.
 */
async function deleteMedia(
	this: RequestUtils,
	mediaId: number,
	restOptions?: Partial< RestOptions >
) {
	const response = await this.rest( {
		...restOptions,
		method: 'DELETE',
		path: `/wp/v2/media/${ mediaId }`,
		params: { force: true },
	} );

	return response;
}

/**
 * delete all media files.
 *
 * @param this
 * @param restOptions Optional REST options to override default settings.
 */
async function deleteAllMedia(
	this: RequestUtils,
	restOptions?: Partial< RestOptions >
) {
	const files = await this.listMedia( restOptions );

	// The media endpoint doesn't support batch request yet.
	const responses = await Promise.all(
		files.map( ( media ) => this.deleteMedia( media.id, restOptions ) )
	);

	return responses;
}

export { listMedia, uploadMedia, deleteMedia, deleteAllMedia };
