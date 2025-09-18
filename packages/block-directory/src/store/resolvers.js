/**
 * External dependencies
 */
import { camelCase } from 'change-case';

/**
 * FinPress dependencies
 */
import apiFetch from '@finpress/api-fetch';

/**
 * Internal dependencies
 */
import { fetchDownloadableBlocks, receiveDownloadableBlocks } from './actions';

export const getDownloadableBlocks =
	( filterValue ) =>
	async ( { dispatch } ) => {
		if ( ! filterValue ) {
			return;
		}

		try {
			dispatch( fetchDownloadableBlocks( filterValue ) );
			const results = await apiFetch( {
				path: `fin/v2/block-directory/search?term=${ filterValue }`,
			} );
			const blocks = results.map( ( result ) =>
				Object.fromEntries(
					Object.entries( result ).map( ( [ key, value ] ) => [
						camelCase( key ),
						value,
					] )
				)
			);

			dispatch( receiveDownloadableBlocks( blocks, filterValue ) );
		} catch {
			dispatch( receiveDownloadableBlocks( [], filterValue ) );
		}
	};
