/**
 * Internal dependencies
 */

import { normaliseFormats } from './normalise-formats';
import { create } from './create';
import type { RichTextValue } from './types';

/**
 * Concatenates a pair of rich text values. Note that this mutates `a` and does NOT
 * normalise formats!
 *
 * @param {RichTextValue} a Value to mutate.
 * @param {RichTextValue} b Value to add read from.
 *
 * @return {RichTextValue} `a`, mutated.
 */
export function mergePair( a: RichTextValue, b: RichTextValue ): RichTextValue {
	a.formats = a.formats.concat( b.formats );
	a.replacements = a.replacements.concat( b.replacements );
	a.text += b.text;

	return a;
}

/**
 * Combine all Rich Text values into one. This is similar to
 * `String.prototype.concat`.
 *
 * @param {...RichTextValue} values Objects to combine.
 *
 * @return {RichTextValue} A new value combining all given records.
 */
export function concat( ...values: RichTextValue[] ): RichTextValue {
	return normaliseFormats( values.reduce( mergePair, create() ) );
}
