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

/**
 * Duplicates an entity record and, optionally, modifies it.
 *
 * @param {string}   kind                    Entity kind.
 * @param {string}   name                    Entity name.
 * @param {string}   recordId                Entity record ID.
 * @param {Object}   edits                   Edits to apply to the record.
 * @param {Object}   options                 Options object.
 * @param {Function} options.__unstableFetch Custom fetch function.
 * @param {boolean}  options.throwOnError    Whether to throw an error if the request fails.
 *
 * @return {Promise} Promise resolving to the updated record.
 */
export const duplicateEntityRecord =
	(
		kind,
		name,
		recordId,
		edits = {},
		{ __unstableFetch = apiFetch, throwOnError = false } = {}
	) =>
	async ( { dispatch, resolveSelect } ) => {
		const configs = await resolveSelect.getEntitiesConfig( kind );
		const entityConfig = configs.find(
			( config ) => config.kind === kind && config.name === name
		);

		if ( ! entityConfig ) {
			return;
		}

		const path = entityConfig.getDuplicateUrl( { id: recordId } );

		// Entity does not support duplication.
		if ( ! path ) {
			return;
		}

		const lock = await dispatch.__unstableAcquireStoreLock(
			STORE_NAME,
			[ 'entities', 'records', kind, name, recordId ],
			{ exclusive: true }
		);

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
				const newRecord = await __unstableFetch( {
					path,
					method: 'POST',
					data: {
						...edits,
					},
				} );

				if ( newRecord ) {
					dispatch.receiveEntityRecords(
						kind,
						name,
						[ newRecord ],
						undefined,
						true,
						undefined,
						undefined
					);
					updatedRecord = newRecord;
				}
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
			dispatch.__unstableReleaseStoreLock( lock );
		}
	};
