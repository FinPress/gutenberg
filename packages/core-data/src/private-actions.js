/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { STORE_NAME } from './name';

/**
 * Returns an action object used in signalling that the registered post meta
 * fields for a post type have been received.
 *
 * @param {string} postType           Post type slug.
 * @param {Object} registeredPostMeta Registered post meta.
 *
 * @return {Object} Action object.
 */
export function receiveRegisteredPostMeta( postType, registeredPostMeta ) {
	return {
		type: 'RECEIVE_REGISTERED_POST_META',
		postType,
		registeredPostMeta,
	};
}

export const duplicateAndModifyEntityRecord =
	(
		kind,
		name,
		recordId,
		edits,
		{ __unstableFetch = apiFetch, throwOnError = false } = {}
	) =>
	async ( { dispatch, resolveSelect } ) => {

		const record = await resolveSelect.getEntityRecord(
			kind,
			name,
			recordId
		);
		const configs = await resolveSelect.getEntitiesConfig( kind );
		const entityConfig = configs.find(
			( config ) => config.kind === kind && config.name === name
		);


		if ( ! entityConfig || ! record ) {
			return;
		}

		const duplicateLink =
			record._links?.[ 'wp:duplicate-modified' ]?.[ 0 ]?.href;

		if ( ! duplicateLink ) {
			return;
		}

		// const lock = await dispatch.__unstableAcquireStoreLock(
		// 	STORE_NAME,
		// 	[ 'entities', 'records', kind, name, recordId ],
		// 	{ exclusive: true }
		// );

		let updatedRecord;
		let error;
		let hasError = false;

		try {
			dispatch( {
				type: 'SAVE_ENTITY_RECORD_START',
				kind,
				name,
				recordId,
			} );

			try {
				const response = await __unstableFetch( {
					path: duplicateLink,
					method: 'POST',
					data: {
						...edits,
					},
				} );
				// Use the response.id to fetch the record from the API.
				const newRecord = await resolveSelect.getEntityRecord(
					kind,
					name,
					response.id
				);
				updatedRecord = newRecord;

				console.log( 'newRecord', newRecord );
			} catch ( e ) {
				error = e;
				hasError = true;
			}

			dispatch( {
				type: 'SAVE_ENTITY_RECORD_FINISH',
				kind,
				name,
				recordId,
				error,
			} );

			if ( hasError && throwOnError ) {
				throw error;
			}
			return updatedRecord;
		} finally {
			//dispatch.__unstableReleaseStoreLock( lock );
		}
	};
