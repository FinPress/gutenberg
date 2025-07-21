/**
 * Internal dependencies
 */

import { insert } from './insert';
import { create } from './create';
import type { RichTextValue } from './types';

/**
 * Remove content from a Rich Text value between the given `startIndex` and
 * `endIndex`. Indices are retrieved from the selection if none are provided.
 *
 * @param value      Value to modify.
 * @param startIndex Start index.
 * @param endIndex   End index.
 *
 * @return A new value with the content removed.
 */
export function remove(
	value: RichTextValue,
	startIndex?: number,
	endIndex?: number
): RichTextValue {
	return insert( value, create(), startIndex, endIndex );
}
