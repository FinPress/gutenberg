/**
 * Utility function to flatten nested HTML tags that should not be nested.
 * This handles nested <strong> and <a> tags which can cause rendering issues
 * or create invalid HTML.
 *
 * @param {string} html The HTML string to process
 * @return {string} The processed HTML with flattened nested tags
 */
export function flattenNestedTags( html ) {
	let processedHtml = html;

	// Fix nested <strong> tags - combine into single tags
	// Handle simple nesting first
	processedHtml = processedHtml.replace(
		/<strong([^>]*)>([^<]*)<strong[^>]*>([^<]*)<\/strong>([^<]*)<\/strong>/gi,
		'<strong$1>$2$3$4</strong>'
	);

	// Handle deeper nesting for strong tags
	let previousHTML;
	do {
		previousHTML = processedHtml;
		processedHtml = processedHtml.replace(
			/<strong([^>]*)>([^<]*(?:<(?!\/strong>|strong)[^<]*)*)<strong[^>]*>([^<]*(?:<(?!\/strong>)[^<]*)*)<\/strong>([^<]*(?:<(?!strong)[^<]*)*)<\/strong>/gi,
			'<strong$1>$2$3$4</strong>'
		);
	} while ( previousHTML !== processedHtml );

	// Fix nested <a> tags - remove inner anchor tags but keep content
	// This handles cases like: <a href="...">text <a href="...">nested</a> more</a>
	// Handle simple nesting first
	processedHtml = processedHtml.replace(
		/<a([^>]*)>([^<]*)<a[^>]*>([^<]*)<\/a>([^<]*)<\/a>/gi,
		'<a$1>$2$3$4</a>'
	);

	// Handle deeper anchor nesting
	do {
		previousHTML = processedHtml;
		processedHtml = processedHtml.replace(
			/<a([^>]*)>([^<]*(?:<(?!\/a>|a\s)[^<]*)*)<a[^>]*>([^<]*(?:<(?!\/a>)[^<]*)*)<\/a>([^<]*(?:<(?!a\s)[^<]*)*)<\/a>/gi,
			'<a$1>$2$3$4</a>'
		);
	} while ( previousHTML !== processedHtml );

	return processedHtml;
}
