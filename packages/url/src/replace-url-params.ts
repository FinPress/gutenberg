/**
 * Internal dependencies
 */
import { getQueryArgs } from './get-query-args';
import { buildQueryString } from './build-query-string';
import { getFragment } from './get-fragment';

/**
 * Replaces URL params from query params to the provided URL. If the URL
 * includes URL argument placeholders, the placeholders are replaced with their
 * query param counterparts, and any remaining query params are appended as a
 * querystring.
 *
 * @param url  URL to which placeholders should be replaced. If omitted,
 *             only the resulting querystring is returned.
 * @param args Query arguments to be used to replace the URL param placeholders.
 *
 * @example
 * ```js
 * const newURL = replaceUrlParams( 'https://google.com/site/{$id}/stats', { id: 123, q: 'test' } ); // https://google.com/site/123/stats?q=test
 * ```
 *
 * @return URL with placeholders replaced.
 */
export function replaceUrlParams(
	url: string = '',
	args?: Record< string, unknown >
): string {
	// If no arguments are to be appended, return original URL.
	if ( ! args || ! Object.keys( args ).length ) {
		return url;
	}

	const fragment = getFragment( url ) || '';
	let baseUrl = url.replace( fragment, '' );

	// Determine whether URL already had query arguments.
	const queryStringIndex = url.indexOf( '?' );
	if ( queryStringIndex !== -1 ) {
		// Merge into existing query arguments.
		args = Object.assign( getQueryArgs( url ), args );

		// Change working base URL to omit previous query arguments.
		baseUrl = baseUrl.substring( 0, queryStringIndex );
	}

	// Determine whether URL has URL parameter placeholders.
	const possiblePlaceholders = Object.keys( args ).map(
		( key: string ) => `{$${ key }}`
	);
	const urlPlaceholders = possiblePlaceholders.filter(
		( placeholder: string ) => baseUrl.includes( placeholder )
	);

	if ( urlPlaceholders.length ) {
		// Replace URL parameter placeholders with their corresponding query param values.
		urlPlaceholders.forEach( ( placeholder: string ) => {
			const key = placeholder.slice( 2, -1 );
			const value = args?.[ key ];
			if ( value !== undefined ) {
				baseUrl = baseUrl.replace(
					placeholder,
					encodeURIComponent( String( value ) )
				);
				// Remove the used arg so it isn't added again in the querystring later.
				delete args?.[ key ];
			}
		} );
	}
	return baseUrl + '?' + buildQueryString( args ) + fragment;
}
