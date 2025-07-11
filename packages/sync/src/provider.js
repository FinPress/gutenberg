/**
 * WordPress dependencies
 */

/**
 * External dependencies
 */
import * as Y from 'yjs';

/** @typedef {import('./types').ObjectType} ObjectType */
/** @typedef {import('./types').ObjectID} ObjectID */
/** @typedef {import('./types').ObjectConfig} ObjectConfig */
/** @typedef {import('./types').ConnectDoc} ConnectDoc */
/** @typedef {import('./types').SyncProvider} SyncProvider */
/** @typedef {import('./types').UndoManager} UndoManager */
/** @typedef {import('./types').HistoryRecord} HistoryRecord */

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
	 * @todo make sure that this used everwhere correctly and that we remove crdtdoc
	 * @type {Record<string,Record<string,{ ydoc: Y.Doc, prevContentClientId: number, destroy: ()=>void }>>}
	 */
	const docs = {};

	/**
	 * @type { { yMap: Y.Map<any> | null, ydoc: Y.Doc | null, instance: UndoManager | null, destroy: ()=>void } }
	 */
	const undoManager = {
		ydoc: null,
		yMap: null,
		instance: null,
		destroy: () => {
			if ( undoManager.instance ) {
				undoManager.instance.destroy();
			}
			undoManager.ydoc = null;
			undoManager.yMap = null;
			undoManager.instance = null;
		},
	};

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

		/**
		 * @type {(_update: Uint8Array, origin: any)=>void}
		 */
		const updateHandler = ( _update, origin ) => {
			if ( origin !== 'gutenberg' ) {
				const data = postTypeConfigs[ objectType ].fromCRDTDoc( doc );
				handleChanges( data );
			}
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

		docs[ objectType ] = docs[ objectType ] || {};
		docs[ objectType ][ objectId ] = {
			ydoc: doc,
			prevContentClientId: 0,
			destroy: () => {
				destroyLocalConnection?.();
				doc.off( 'update', updateHandler );
				doc.destroy();
				delete docs[ objectType ][ objectId ];
			},
		};

		if ( objectType.startsWith( 'postType/' ) ) {
			// Create an undo manager for the document.
			const undoManagerMap = doc.getMap( 'document' );
			const yUndoManager = new Y.UndoManager( undoManagerMap, {
				// Ensure we undo and redo one character at a time.
				captureTimeout: 0,
				// Ensure that we only scope the undo/redo to the current client, and Gutenberg origins.
				// ToDo: Keep an eye on this, as it needs to be battle tested.
				trackedOrigins: new Set( [ 'gutenberg', doc.clientID ] ),
			} );
			undoManager.ydoc = doc;
			undoManager.yMap = undoManagerMap;
			undoManager.instance = yUndoManager;
		}

		// @todo do proper typings for fetch api
		/**
		 * @type {any}
		 */
		const loadRemotely = postTypeConfigs[ objectType ].fetch;
		if ( loadRemotely ) {
			const data = await loadRemotely( objectId, true );
			doc.transact( () => {
				postTypeConfigs[ objectType ].applyChangesToDoc( doc, data );
			}, 'gutenberg' );
			return data;
		}

		return null;
	}

	/**
	 * Check the UndoManager to see if it can undo.
	 *
	 * @return {boolean} Whether the undo manager can undo.
	 */
	function canUndo() {
		return undoManager?.instance?.canUndo() || false;
	}

	/**
	 * Check the UndoManager to see if it can redo.
	 *
	 * @return {boolean} Whether the undo manager can redo.
	 */
	function canRedo() {
		return undoManager?.instance?.canRedo() || false;
	}

	/**
	 * Undo the last operation, scoped to the current client.
	 *
	 * @return {HistoryRecord} The changes made by the undo operation.
	 */
	function undo() {
		undoManager?.instance?.undo();

		// ToDo: This isn't 100% correct, but can't really find a way to return the changes from Yjs that could be transformed to Gutenberg format.
		return [];
	}

	/**
	 * Redo the last operation, scoped to the current client.
	 *
	 * @return {HistoryRecord} The changes made by the redo operation.
	 */
	function redo() {
		undoManager?.instance?.redo();

		// ToDo: This isn't 100% correct, but can't really find a way to return the changes from Yjs that could be transformed to Gutenberg format.
		return [];
	}

	/**
	 * This is a no-op way to add a record to the undo stack, for gutenberg's undo manager.
	 *
	 * @param {HistoryRecord} record   The record to add to the undo stack.
	 * @param {boolean}       isStaged Whether the record is staged.
	 */
	// eslint-disable-next-line no-unused-vars
	function addRecord( record, isStaged = false ) {
		// ToDo: This is a no-op in the sync provider context at the moment, as Yjs UndoManager handles it automatically.
	}

	/**
	 * Fetch data from local database or remote source.
	 *
	 * @param {ObjectType} objectType Object type to load.
	 * @param {ObjectID}   objectId   Object ID to load.
	 * @param {any}        data       Updates to make.
	 * @param {any}        origin     The source of change.
	 */
	function update( objectType, objectId, data, origin ) {
		const docDef = docs[ objectType ]?.[ objectId ];
		if ( ! docDef ) {
			throw 'Error doc ' + objectType + ' ' + objectId + ' not found';
		}
		docDef.ydoc.transact( () => {
			postTypeConfigs[ objectType ].applyChangesToDoc(
				docDef.ydoc,
				data
			);
		}, origin );
	}

	/**
	 * Stop updating a document and discard it.
	 *
	 * @param {ObjectType} objectType Object type to load.
	 * @param {ObjectID}   objectId   Object ID to load.
	 */
	async function discard( objectType, objectId ) {
		if ( objectType.startsWith( 'postType/' ) && undoManager.instance ) {
			undoManager.instance.destroy();
		}

		docs[ objectType ]?.[ objectId ]?.destroy();
	}

	/**
	 * Encode Yjs document as update.
	 *
	 * @param {ObjectType} objectType Object type to load.
	 * @param {ObjectID}   objectId   Object ID to load.
	 */
	function encodeState( objectType, objectId ) {
		const docDef = docs[ objectType ]?.[ objectId ];
		if ( ! docDef ) {
			return null;
		}
		return Y.encodeStateAsUpdateV2( docDef.ydoc );
	}

	return {
		register,
		bootstrap,
		update,
		addRecord,
		undo,
		canUndo,
		redo,
		canRedo,
		encodeState,
		discard,
		postTypeConfigs,
	};
};
