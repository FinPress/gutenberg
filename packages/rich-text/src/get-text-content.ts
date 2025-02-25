/**
 * Internal dependencies
 */
import { OBJECT_REPLACEMENT_CHARACTER } from './special-characters';
import type { RichTextValue } from './types';

/**
 * Get the textual content of a Rich Text value. This is similar to
 * `Element.textContent`.
 *
 * @param value Value to use.
 *
 * @return The text content.
 */
export function getTextContent( value: RichTextValue ): string {
	return value.text.replace( OBJECT_REPLACEMENT_CHARACTER, '' );
}
