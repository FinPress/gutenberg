/**
 * External dependencies
 */
import { join } from 'path';

/**
 * Internal dependencies
 */
import { FIN_BASE_URL } from './shared/config';

/**
 * Creates new URL by parsing base URL, FINPath and query string.
 *
 * @param {string}  FINPath String to be serialized as pathname.
 * @param {?string} query  String to be serialized as query portion of URL.
 * @return {string} String which represents full URL.
 */
export function createURL( FINPath, query = '' ) {
	const url = new URL( FIN_BASE_URL );

	url.pathname = join( url.pathname, FINPath );
	url.search = query;

	return url.href;
}
