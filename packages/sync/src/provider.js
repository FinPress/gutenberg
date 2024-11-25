/**
 * External dependencies
 */
// @ts-ignore
import * as Y from 'yjs';

/** @typedef {import('./types').ObjectType} ObjectType */
/** @typedef {import('./types').ObjectID} ObjectID */
/** @typedef {import('./types').ObjectConfig} ObjectConfig */
/** @typedef {import('./types').CRDTDoc} CRDTDoc */
/** @typedef {import('./types').ConnectDoc} ConnectDoc */
/** @typedef {import('./types').SyncProvider} SyncProvider */

/**
 * Create a sync provider.
 *
 * @param {ConnectDoc | null} connectLocal  Connect the document to a local database.
 * @param {ConnectDoc | null} connectRemote Connect the document to a remote sync connection.
 * @return {SyncProvider} Sync provider.
 */
export const createSyncProvider = ( connectLocal, connectRemote ) => {
	/**
	 * @type {Record<string,ObjectConfig>}
	 */
	const postTypeConfigs = {};

	/**
	 * @type {Record<string,Record<string,()=>void>>}
	 */
	const listeners = {};

	/**
	 * @type {Record<string,Record<string,CRDTDoc>>}
	 */
	const docs = {};

	/**
	 * Registers an object type.
	 *
	 * @param {ObjectType}   objectType   Object type to register.
	 * @param {ObjectConfig} objectConfig Object config.
	 */
	function register( objectType, objectConfig ) {
		postTypeConfigs[ objectType ] = objectConfig;
	}

	/**
	 * Fetch data from local database or remote source.
	 *
	 * @param {ObjectType} objectType    Object type to load.
	 * @param {ObjectID}   objectId      Object ID to load.
	 * @param {Function}   handleChanges Callback to call when data changes.
	 */
	async function bootstrap( objectType, objectId, handleChanges ) {
		const doc = new Y.Doc( { meta: new Map() } );
		docs[ objectType ] = docs[ objectType ] || {};
		docs[ objectType ][ objectId ] = doc;

		const updateHandler = () => {
			// debugger // @todo This handles changes from the Yjs doc
			const data = postTypeConfigs[ objectType ].fromCRDTDoc( doc );
			handleChanges( data );
		};
		doc.on( 'update', updateHandler );

		let destroyLocalConnection = null;

		if ( connectLocal ) {
			// connect to locally saved database.
			destroyLocalConnection = await connectLocal(
				objectId,
				objectType,
				doc
			);
		}

		// Once the database syncing is done, start the remote syncing
		if ( connectRemote ) {
			connectRemote( objectId, objectType, doc );
		}

		listeners[ objectType ] = listeners[ objectType ] || {};
		listeners[ objectType ][ objectId ] = () => {
			destroyLocalConnection?.();
			doc.off( 'update', updateHandler );
		};

		// @todo do proper typings for fetch api
		/**
		 * @type {any}
		 */
		const loadRemotely = postTypeConfigs[ objectType ].fetch;
		if ( loadRemotely ) {
			const data = await loadRemotely( objectId, true );
			doc.transact( () => {
				postTypeConfigs[ objectType ].applyChangesToDoc( doc, data );
			} );
			return data;
		}
		return null;
	}

	/**
	 * Fetch data from local database or remote source.
	 *
	 * @param {ObjectType} objectType Object type to load.
	 * @param {ObjectID}   objectId   Object ID to load.
	 * @param {any}        data       Updates to make.
	 */
	async function update( objectType, objectId, data ) {
		const doc = docs[ objectType ]?.[ objectId ];
		if ( ! doc ) {
			throw 'Error doc ' + objectType + ' ' + objectId + ' not found';
		}
		doc.transact( () => {
			postTypeConfigs[ objectType ].applyChangesToDoc( doc, data );
		} );
	}

	/**
	 * Stop updating a document and discard it.
	 *
	 * @param {ObjectType} objectType Object type to load.
	 * @param {ObjectID}   objectId   Object ID to load.
	 */
	async function discard( objectType, objectId ) {
		if ( listeners?.[ objectType ]?.[ objectId ] ) {
			listeners[ objectType ][ objectId ]();
		}
	}

	/**
	 * Encode Yjs document as update.
	 *
	 * @param {ObjectType} objectType Object type to load.
	 * @param {ObjectID}   objectId   Object ID to load.
	 */
	function encodeState( objectType, objectId ) {
		const doc = docs[ objectType ]?.[ objectId ];
		if ( ! doc ) {
			throw 'Error doc ' + objectType + ' ' + objectId + ' not found';
		}
		return Y.encodeStateAsUpdateV2( doc );
	}

	return {
		register,
		bootstrap,
		update,
		encodeState,
		discard,
		postTypeConfigs,
	};
};
