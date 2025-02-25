/**
 * Internal dependencies
 */
import type { RichTextValue } from './types';

/**
 * Check if a Rich Text value is empty, meaning it contains no text or any
 * objects (such as images).
 *
 * @param value Value to use.
 *
 * @return True if the value is empty, false if not.
 */
export function isEmpty( value: RichTextValue ): boolean {
	return value.text.length === 0;
}
