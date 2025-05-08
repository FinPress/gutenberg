/**
 * Utilities for the shortcode block.
 */

/**
 * Regular expression that identifies embed shortcodes.
 *
 * @type {RegExp}
 */
export const EMBED_SHORTCODE_REGEX = /^\[embed\]\s*(.+?)\s*\[\/embed\]$/i;

/**
 * Extracts the URL from an embed shortcode string.
 *
 * @param {string} shortcodeText The embed shortcode text.
 * @return {string}              The extracted URL or empty string.
 */
export function extractEmbedUrl( shortcodeText ) {
	if ( ! shortcodeText ) {
		return '';
	}

	const matches = shortcodeText.match( EMBED_SHORTCODE_REGEX );
	if ( matches && matches[ 1 ] ) {
		return matches[ 1 ].trim();
	}

	return '';
}

/**
 * Checks if a string is an embed shortcode.
 *
 * @param {string} text The text to check.
 * @return {boolean}    Whether the text is an embed shortcode.
 */
export function isEmbedShortcode( text ) {
	return !! text && EMBED_SHORTCODE_REGEX.test( text );
}
