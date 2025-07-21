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
 * Returns a registered format type.
 *
 * @param name - Format name.
 *
 * @return RichTextFormat | undefined - Format type.
 */
export function getFormatType( name: string ): WPFormat | undefined {
	// @ts-expect-error Stores are not typed
	return select( richTextStore ).getFormatType( name );
}
