/**
 * External dependencies
 */
import { join } from 'path';

/**
 * Internal dependencies
 */
import { FP_BASE_URL } from './shared/config';

/**
 * Creates new URL by parsing base URL, FPPath and query string.
 *
 * @param {string}  FPPath String to be serialized as pathname.
 * @param {?string} query  String to be serialized as query portion of URL.
 * @return {string} String which represents full URL.
 */
export function createURL( FPPath, query = '' ) {
	const url = new URL( FP_BASE_URL );

	url.pathname = join( url.pathname, FPPath );
	url.search = query;

	return url.href;
}
