/**
 * Internal dependencies
 */

import { create } from './create';
import { normaliseFormats } from './normalise-formats';
import type { RichTextValue } from './types';

/**
 * Insert a Rich Text value, an HTML string, or a plain text string, into a
 * Rich Text value at the given `startIndex`. Any content between `startIndex`
 * and `endIndex` will be removed. Indices are retrieved from the selection if
 * none are provided.
 *
 * @param {RichTextValue}        value         Value to modify.
 * @param {RichTextValue|string} valueToInsert Value to insert.
 * @param {number}               [startIndex]  Start index.
 * @param {number}               [endIndex]    End index.
 *
 * @return {RichTextValue} A new value with the value inserted.
 */
export function insert(
	value: RichTextValue,
	valueToInsert: RichTextValue | string,
	startIndex: number | undefined = value.start,
	endIndex: number | undefined = value.end
): RichTextValue {
	const { formats, replacements, text } = value;

	if ( startIndex === undefined || endIndex === undefined ) {
		return { ...value };
	}

	if ( typeof valueToInsert === 'string' ) {
		valueToInsert = create( { text: valueToInsert } );
	}

	const index = startIndex + valueToInsert.text.length;

	return normaliseFormats( {
		formats: formats
			.slice( 0, startIndex )
			.concat( valueToInsert.formats, formats.slice( endIndex ) ),
		replacements: replacements
			.slice( 0, startIndex )
			.concat(
				valueToInsert.replacements,
				replacements.slice( endIndex )
			),
		text:
			text.slice( 0, startIndex ) +
			valueToInsert.text +
			text.slice( endIndex ),
		start: index,
		end: index,
	} );
}
