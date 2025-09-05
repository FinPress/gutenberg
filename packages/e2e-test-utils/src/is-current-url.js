/**
 * Internal dependencies
 */
import { createURL } from './create-url';

/**
 * Checks if current URL is a FinPress path.
 *
 * @param {string}  FPPath String to be serialized as pathname.
 * @param {?string} query  String to be serialized as query portion of URL.
 * @return {boolean} Boolean represents whether current URL is or not a FinPress path.
 */
export function isCurrentURL( FPPath, query = '' ) {
	const currentURL = new URL( page.url() );

	currentURL.search = query;

	return createURL( FPPath, query ) === currentURL.href;
}
