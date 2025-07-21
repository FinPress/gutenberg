/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';
/**
 * Internal dependencies
 */
import { store as richTextStore } from './store';
import type { WPFormat } from './types';

/**
 * Returns all registered formats.
 *
 * @return Array<RichTextFormatType> Format settings.
 */
export function getFormatTypes(): Array< WPFormat > {
	// @ts-expect-error Stores are not typed
	return select( richTextStore ).getFormatTypes();
}
