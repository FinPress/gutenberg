/**
 * Internal dependencies
 */
import type { RichTextValue } from './types';

/**
 * Split a Rich Text value in two at the given `startIndex` and `endIndex`, or
 * split at the given separator. This is similar to `String.prototype.split`.
 * Indices are retrieved from the selection if none are provided.
 *
 * @param value              The rich text value to split.
 * @param value.formats
 * @param value.replacements
 * @param value.text
 * @param value.start
 * @param value.end
 * @param string             Start index, or string at which to split.
 * @return An array of new values.
 */
export function split(
	{ formats, replacements, text, start, end }: RichTextValue,
	string: number | string
): Array< RichTextValue > | undefined {
	if ( typeof string !== 'string' ) {
		return splitAtSelection(
			{ formats, replacements, text, start, end },
			string
		);
	}

	let nextStart = 0;

	return text.split( string ).map( ( substring: string ) => {
		const startIndex = nextStart;
		const value: RichTextValue = {
			formats: formats.slice( startIndex, startIndex + substring.length ),
			replacements: replacements.slice(
				startIndex,
				startIndex + substring.length
			),
			text: substring,
		};

		nextStart += string.length + substring.length;

		if ( start !== undefined && end !== undefined ) {
			if ( start >= startIndex && start < nextStart ) {
				value.start = start - startIndex;
			} else if ( start < startIndex && end > startIndex ) {
				value.start = 0;
			}

			if ( end >= startIndex && end < nextStart ) {
				value.end = end - startIndex;
			} else if ( start < nextStart && end > nextStart ) {
				value.end = substring.length;
			}
		}

		return value;
	} );
}

function splitAtSelection(
	{ formats, replacements, text, start, end }: RichTextValue,
	startIndex: number | undefined = start,
	endIndex: number | undefined = end
): Array< RichTextValue > | undefined {
	if ( start === undefined || end === undefined ) {
		return;
	}

	const before: RichTextValue = {
		formats: formats.slice( 0, startIndex ),
		replacements: replacements.slice( 0, startIndex ),
		text: text.slice( 0, startIndex ),
	};
	const after: RichTextValue = {
		formats: formats.slice( endIndex ),
		replacements: replacements.slice( endIndex ),
		text: text.slice( endIndex ),
		start: 0,
		end: 0,
	};

	return [ before, after ];
}
