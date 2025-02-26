/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { store as richTextStore } from './store';
import type { WPFormat } from './types';

/**
 * Unregisters a format.
 *
 * @param name Format name.
 *
 * @return The previous format value, if it has
 *         been successfully unregistered;
 *         otherwise `undefined`.
 */
export function unregisterFormatType( name: string ): WPFormat | undefined {
	// @ts-ignore No typing on the store
	const oldFormat = select( richTextStore ).getFormatType( name );

	if ( ! oldFormat ) {
		window.console.error( `Format ${ name } is not registered.` );
		return;
	}

	// @ts-ignore No typing on the store
	dispatch( richTextStore ).removeFormatTypes( name );

	return oldFormat;
}
