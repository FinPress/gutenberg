/**
 * Internal dependencies
 */
import { NEW_TAB_REL, NEW_TAB_TARGET, NOFOLLOW_REL } from './constants';

/**
 * WordPress dependencies
 */
import { prependHTTP } from '@wordpress/url';

/**
 * Updates the link attributes.
 *
 * @param {Object}  attributes               The current block attributes.
 * @param {string}  attributes.rel           The current link rel attribute.
 * @param {string}  attributes.url           The current link url.
 * @param {boolean} attributes.opensInNewTab Whether the link should open in a new window.
 * @param {boolean} attributes.nofollow      Whether the link should be marked as nofollow.
 * @param {boolean} attributes.download      Whether the link should allow download.
 */
export function getUpdatedLinkAttributes( {
	rel = '',
	url = '',
	opensInNewTab,
	nofollow,
	download = false,
} ) {
	let newLinkTarget;
	// Since `rel` is editable attribute, we need to check for existing values and proceed accordingly.
	let updatedRel = rel;

	if ( opensInNewTab ) {
		newLinkTarget = NEW_TAB_TARGET;
		updatedRel = updatedRel?.includes( NEW_TAB_REL )
			? updatedRel
			: updatedRel + ` ${ NEW_TAB_REL }`;
	} else {
		const relRegex = new RegExp( `\\b${ NEW_TAB_REL }\\s*`, 'g' );
		updatedRel = updatedRel?.replace( relRegex, '' ).trim();
	}

	if ( nofollow ) {
		updatedRel = updatedRel?.includes( NOFOLLOW_REL )
			? updatedRel
			: ( updatedRel + ` ${ NOFOLLOW_REL }` ).trim();
	} else {
		const relRegex = new RegExp( `\\b${ NOFOLLOW_REL }\\s*`, 'g' );
		updatedRel = updatedRel?.replace( relRegex, '' ).trim();
	}

	const allowDownload = url && isSameOrigin( url ) ? download : undefined;

	return {
		url: prependHTTP( url ),
		linkTarget: newLinkTarget,
		rel: updatedRel || undefined,
		download: allowDownload,
	};
}

/**
 * Checks if the URL is same origin.
 * Allow relative URLs.
 *
 * @param {string} urlString The URL to check.
 * @return {boolean} Whether the URL is same origin.
 */
function isSameOrigin( urlString ) {
	// Allow relative URLs
	if ( urlString.startsWith( '/' ) ) {
		return true;
	}

	try {
		const url = new URL( urlString, window.location.origin );
		return url.origin === window.location.origin;
	} catch {
		return false;
	}
}
