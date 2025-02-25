/**
 * Internal dependencies
 */

import { normaliseFormats } from './normalise-formats';
import type { RichTextValue, RichTextFormat } from './types';

/**
 * Remove any format object from a Rich Text value by type from the given
 * `startIndex` to the given `endIndex`. Indices are retrieved from the
 * selection if none are provided.
 *
 * @param {RichTextValue} value        Value to modify.
 * @param {string}        formatType   Format type to remove.
 * @param {number}        [startIndex] Start index.
 * @param {number}        [endIndex]   End index.
 *
 * @return {RichTextValue} A new value with the format applied.
 */
export function removeFormat(
	value: RichTextValue,
	formatType: string,
	startIndex: number = value.start,
	endIndex: number = value.end
): RichTextValue {
	const { formats, activeFormats } = value;
	const newFormats = formats.slice();

	// If the selection is collapsed, expand start and end to the edges of the
	// format.
	if ( startIndex === endIndex ) {
		const format = newFormats[ startIndex ]?.find(
			( { type }: RichTextFormat ) => type === formatType
		);

		if ( format ) {
			while (
				newFormats[ startIndex ]?.find(
					( newFormat: RichTextFormat ) => newFormat === format
				)
			) {
				filterFormats( newFormats, startIndex, formatType );
				startIndex--;
			}

			endIndex++;

			while (
				newFormats[ endIndex ]?.find(
					( newFormat: RichTextFormat ) => newFormat === format
				)
			) {
				filterFormats( newFormats, endIndex, formatType );
				endIndex++;
			}
		}
	} else {
		for ( let i = startIndex; i < endIndex; i++ ) {
			if ( newFormats[ i ] ) {
				filterFormats( newFormats, i, formatType );
			}
		}
	}

	return normaliseFormats( {
		...value,
		formats: newFormats,
		activeFormats:
			activeFormats?.filter(
				( { type }: RichTextFormat ) => type !== formatType
			) || [],
	} );
}

function filterFormats(
	formats: Array< RichTextFormat[] >,
	index: number,
	formatType: string
): void {
	const newFormats = formats[ index ].filter(
		( { type }: RichTextFormat ) => type !== formatType
	);

	if ( newFormats.length ) {
		formats[ index ] = newFormats;
	} else {
		delete formats[ index ];
	}
}
