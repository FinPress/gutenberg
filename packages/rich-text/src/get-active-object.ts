/**
 * Internal dependencies
 */

import { OBJECT_REPLACEMENT_CHARACTER } from './special-characters';
import type { RichTextValue, RichTextFormat } from './types';

/**
 * Gets the active object, if there is any.
 *
 * @param {RichTextValue} value Value to inspect.
 *
 * @return {RichTextFormat | undefined} Active object, or undefined.
 */
export function getActiveObject(
	value: RichTextValue
): RichTextFormat | undefined {
	const { start, end, replacements, text } = value;
	if ( start + 1 !== end || text[ start ] !== OBJECT_REPLACEMENT_CHARACTER ) {
		return;
	}

	return replacements[ start ];
}
