/**
 * WordPress dependencies
 */

/**
 * External dependencies
 */
// @ts-ignore
import * as Y from 'yjs';

/** @typedef {import('./types').ObjectType} ObjectType */
/** @typedef {import('./types').ObjectID} ObjectID */
/** @typedef {import('./types').ObjectConfig} ObjectConfig */
/** @typedef {import('./types').ConnectDoc} ConnectDoc */
/** @typedef {import('./types').SyncProvider} SyncProvider */
/** @typedef {import('./types').UndoManager} UndoManager */

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
	 * @type {Record<string,Record<string,{ ydoc: Y.Doc, undoManager: UndoManager, destroy: ()=>void }>>}
	 */
	const undoManagers = {};

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

		undoManagers[ objectType ] = undoManagers[ objectType ] || {};
		const yUndoManager = new Y.UndoManager( doc.getMap( 'document' ), {
			captureTimeout: 0,
			trackedOrigins: new Set( [ 'gutenberg', doc.clientID ] ),
		} );
		// @ts-ignore
		yUndoManager.on( 'stack-item-added', ( stackItem ) => {
			// eslint-disable-next-line no-console
			console.log( 'Undo manager stack item added:', stackItem );
		} );
		// @ts-ignore
		yUndoManager.on( 'stack-item-popped', ( stackItem ) => {
			// eslint-disable-next-line no-console
			console.log( 'Undo manager stack item removed:', stackItem );
		} );
		// @ts-ignore
		yUndoManager.on( 'stack-item-updated', ( stackItem ) => {
			// eslint-disable-next-line no-console
			console.log( 'Undo manager stack item updated:', stackItem );
		} );
		yUndoManager.on(
			'stack-cleared',
			// @ts-ignore
			( { undoStackCleared, redoStackCleared } ) => {
				// eslint-disable-next-line no-console
				console.log( 'Undo manager stack cleared:', {
					undoStackCleared,
					redoStackCleared,
				} );
			}
		);
		undoManagers[ objectType ][ objectId ] = {
			ydoc: doc,
			undoManager: yUndoManager,
			destroy: () => {
				yUndoManager.destroy();
				delete undoManagers[ objectType ][ objectId ];
			},
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
			}, 'gutenberg' );
			return data;
		}

		return null;
	}

	function clearUndos() {
		const undoManager = undoManagers[ 'postType/Posts' ][ 81 ]?.undoManager;

		if ( ! undoManager ) {
			throw new Error( 'Undo manager is not initialized.' );
		}

		undoManager.clear( true, false );
	}

	function clearRedos() {
		const undoManager = undoManagers[ 'postType/Posts' ][ 81 ]?.undoManager;

		if ( ! undoManager ) {
			throw new Error( 'Undo manager is not initialized.' );
		}

		undoManager.clear( false, true );
	}

	function canUndo() {
		const undoManager = undoManagers[ 'postType/Posts' ][ 81 ]?.undoManager;

		if ( ! undoManager ) {
			throw new Error( 'Undo manager is not initialized.' );
		}

		return undoManager.canUndo();
	}

	function canRedo() {
		const undoManager = undoManagers[ 'postType/Posts' ][ 81 ]?.undoManager;

		if ( ! undoManager ) {
			throw new Error( 'Undo manager is not initialized.' );
		}

		return undoManager.canRedo();
	}

	function undo() {
		const undoManager = undoManagers[ 'postType/Posts' ][ 81 ]?.undoManager;

		if ( ! undoManager ) {
			throw new Error( 'Undo manager is not initialized.' );
		}

		const stackItem = undoManager.undo();

		// eslint-disable-next-line no-console
		console.log( 'Undoing changes:', stackItem );
	}

	function redo() {
		const undoManager = undoManagers[ 'postType/Posts' ][ 81 ]?.undoManager;

		if ( ! undoManager ) {
			throw new Error( 'Undo manager is not initialized.' );
		}

		const stackItem = undoManager.redo();

		// eslint-disable-next-line no-console
		console.log( 'Redoing changes:', stackItem );
	}

	// @ts-ignore
	function addRecord( record, isStaged = false ) {
		const undoManager = undoManagers[ 'postType/Posts' ][ 81 ]?.undoManager;

		if ( ! undoManager ) {
			throw new Error( 'Undo manager is not initialized.' );
		}

		// eslint-disable-next-line no-console
		console.log( 'Adding record:', record, isStaged );
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
		undoManagers[ objectType ]?.[ objectId ]?.undoManager?.destroy();
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
		clearUndos,
		clearRedos,
		encodeState,
		discard,
		postTypeConfigs,
	};
};
