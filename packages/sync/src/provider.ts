/**
 * WordPress dependencies
 */

/**
 * External dependencies
 */
import type { Awareness } from 'y-protocols/awareness';
import { removeAwarenessStates as removeAwarenessStatesFromProtocol } from 'y-protocols/awareness';
import * as Y from 'yjs';
/**
 * Internal dependencies
 */
import type {
	AwarenessEventListener,
	ConnectDoc,
	HistoryRecord,
	ObjectConfig,
	ObjectID,
	ObjectType,
	PendingAwarenessSetup,
	SyncProvider,
} from './types';

const AWARENESS_DOC_TYPE = 'postType/Posts';

/**
 * Create a sync provider.
 *
 * @param {ConnectDoc | null} connectLocal  Connect the document to a local database.
 * @param {ConnectDoc | null} connectRemote Connect the document to a remote sync connection.
 * @return {SyncProvider} Sync provider.
 */
export const createSyncProvider = (
	connectLocal: ConnectDoc | null,
	connectRemote: ConnectDoc | null
): SyncProvider => {
	const postTypeConfigs: Record< string, ObjectConfig > = {};

	/**
	 * @todo make sure that this used everwhere correctly and that we remove crdtdoc
	 */
	const docs: Record<
		string,
		Record<
			string,
			{
				ydoc: Y.Doc;
				prevContentClientId: number;
				destroy: () => void;
				awareness: Awareness | null;
			}
		>
	> = {};

	const undoManager: {
		yMap: Y.Map< any > | null;
		ydoc: Y.Doc | null;
		instance: Y.UndoManager | null;
		destroy: () => void;
	} = {
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

	const pendingAwarenessSetup: PendingAwarenessSetup = {
		pendingListeners: {
			ready: [],
			update: [],
			change: [],
		},
		pendingStateFields: {},
	};

	/**
	 * Registers an object type.
	 *
	 * @param {ObjectType}   objectType   Object type to register.
	 * @param {ObjectConfig} objectConfig Object config.
	 */
	function register( objectType: ObjectType, objectConfig: ObjectConfig ) {
		postTypeConfigs[ objectType ] = objectConfig;
	}

	/**
	 * Fetch data from local database or remote source.
	 *
	 * @param {ObjectType} objectType    Object type to load.
	 * @param {ObjectID}   objectId      Object ID to load.
	 * @param {Function}   handleChanges Callback to call when data changes.
	 */
	async function bootstrap(
		objectType: ObjectType,
		objectId: ObjectID,
		handleChanges: Function
	) {
		const doc = new Y.Doc( { meta: new Map() } );

		const updateHandler: ( _update: Uint8Array, origin: any ) => void = (
			_update,
			origin
		): void => {
			if ( origin !== 'gutenberg' ) {
				const data = postTypeConfigs[ objectType ].fromCRDTDoc( doc );
				handleChanges( data );
			}
		};
		doc.on( 'update', updateHandler );

		let connectLocalResult = null;

		if ( connectLocal ) {
			// connect to locally saved database.
			connectLocalResult = await connectLocal(
				objectId,
				objectType,
				doc
			);
		}

		let connectRemoteResult = null;

		// Once the database syncing is done, start the remote syncing
		if ( connectRemote ) {
			connectRemoteResult = await connectRemote(
				objectId,
				objectType,
				doc
			);
		}

		docs[ objectType ] = docs[ objectType ] || {};
		docs[ objectType ][ objectId ] = {
			ydoc: doc,
			prevContentClientId: 0,
			awareness: connectRemoteResult?.awareness || null,
			destroy: () => {
				connectLocalResult?.destroy?.();
				connectRemoteResult?.destroy?.();

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
				// This ensures that are able to improve the client specific undo/redo experience.
				// This reduces the bugs we see, but it doesn't eliminate them entirely.
				ignoreRemoteMapChanges: true,
			} );
			undoManager.ydoc = doc;
			undoManager.yMap = undoManagerMap;
			undoManager.instance = yUndoManager;
		}

		if (
			objectType === AWARENESS_DOC_TYPE &&
			docs[ objectType ][ objectId ].awareness
		) {
			await bootstrapAwareness(
				docs[ objectType ][ objectId ].awareness,
				pendingAwarenessSetup
			);
		}

		// @todo do proper typings for fetch api
		const loadRemotely: any = postTypeConfigs[ objectType ].fetch;
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
	function canUndo(): boolean {
		return undoManager?.instance?.canUndo() || false;
	}

	/**
	 * Check the UndoManager to see if it can redo.
	 *
	 * @return {boolean} Whether the undo manager can redo.
	 */
	function canRedo(): boolean {
		return undoManager?.instance?.canRedo() || false;
	}

	/**
	 * Undo the last operation, scoped to the current client.
	 *
	 * @return {HistoryRecord} The changes made by the undo operation.
	 */
	function undo(): HistoryRecord {
		undoManager?.instance?.undo();

		// ToDo: This isn't 100% correct, but can't really find a way to return the changes from Yjs that could be transformed to Gutenberg format.
		return [];
	}

	/**
	 * Redo the last operation, scoped to the current client.
	 *
	 * @return {HistoryRecord} The changes made by the redo operation.
	 */
	function redo(): HistoryRecord {
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
	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
	function addRecord( record: HistoryRecord, isStaged: boolean = false ) {
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
	function update(
		objectType: ObjectType,
		objectId: ObjectID,
		data: any,
		origin: any
	) {
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
	async function discard( objectType: ObjectType, objectId: ObjectID ) {
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
	function encodeState( objectType: ObjectType, objectId: ObjectID ) {
		const docDef = docs[ objectType ]?.[ objectId ];
		if ( ! docDef ) {
			return null;
		}
		return Y.encodeStateAsUpdateV2( docDef.ydoc );
	}

	// Awareness handlers

	/**
	 * Add a listener for awareness events.
	 *
	 * @param {'update'|'change'}      eventType              Event type.
	 * @param {AwarenessEventListener} awarenessEventListener Awareness event listener.
	 */
	function addListener(
		eventType: 'update' | 'change',
		awarenessEventListener: AwarenessEventListener
	) {
		if ( docs[ AWARENESS_DOC_TYPE ] ) {
			for ( const objectId in docs[ AWARENESS_DOC_TYPE ] ) {
				const docDef = docs[ AWARENESS_DOC_TYPE ][ objectId ];
				if ( docDef?.awareness ) {
					docDef.awareness.on( eventType, awarenessEventListener );
					return;
				}
			}
		} else {
			pendingAwarenessSetup.pendingListeners[ eventType ].push(
				awarenessEventListener
			);
		}
	}

	/**
	 * Add a listener for awareness events.
	 *
	 * @param {string} field Field name.
	 * @param {any}    value State value.
	 */
	function setLocalStateField( field: string, value: any ) {
		if ( docs[ AWARENESS_DOC_TYPE ] ) {
			for ( const objectId in docs[ AWARENESS_DOC_TYPE ] ) {
				const docDef = docs[ AWARENESS_DOC_TYPE ][ objectId ];

				if ( docDef?.awareness ) {
					docDef.awareness.setLocalStateField( field, value );
					return;
				}
			}
		} else {
			pendingAwarenessSetup.pendingStateFields[ field ] = value;
		}
	}

	/**
	 * Get the states of all documents.
	 *
	 * @return {Map<number,Record<string,any>>|null} States.
	 */
	function getStates(): Map< number, Record< string, any > > | null {
		if ( docs[ AWARENESS_DOC_TYPE ] ) {
			for ( const objectId in docs[ AWARENESS_DOC_TYPE ] ) {
				const docDef = docs[ AWARENESS_DOC_TYPE ][ objectId ];

				const states = docDef?.awareness?.getStates();
				if ( states ) {
					return states;
				}
			}
		}

		return null;
	}

	function removeAwarenessStates() {
		if ( docs[ AWARENESS_DOC_TYPE ] ) {
			for ( const objectId in docs[ AWARENESS_DOC_TYPE ] ) {
				const docDef = docs[ AWARENESS_DOC_TYPE ][ objectId ];

				if ( docDef?.awareness ) {
					removeAwarenessStatesFromProtocol(
						docDef.awareness,
						[ docDef.awareness.clientID ],
						'removeAwarenessStates'
					);
				}
			}
		}

		return null;
	}

	function getLocalState(): Record< string, any > | null {
		if ( docs[ AWARENESS_DOC_TYPE ] ) {
			for ( const objectId in docs[ AWARENESS_DOC_TYPE ] ) {
				const docDef = docs[ AWARENESS_DOC_TYPE ][ objectId ];

				if ( docDef?.awareness?.getLocalState ) {
					return docDef?.awareness?.getLocalState();
				}
			}
		}

		return null;
	}

	function getClientId(): number | null {
		if ( docs[ AWARENESS_DOC_TYPE ] ) {
			for ( const objectId in docs[ AWARENESS_DOC_TYPE ] ) {
				const docDef = docs[ AWARENESS_DOC_TYPE ][ objectId ];

				if ( docDef?.awareness?.clientID ) {
					return docDef?.awareness?.clientID;
				}
			}
		}

		return null;
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

		awareness: {
			addListener,
			getStates,
			setLocalStateField,
			removeAwarenessStates,
			getLocalState,
			getClientId,
		},
	};
};

/**
 * @param {Awareness}             awareness             Awareness.
 * @param {PendingAwarenessSetup} pendingAwarenessSetup Pending listeners.
 */
async function bootstrapAwareness(
	awareness: Awareness,
	pendingAwarenessSetup: PendingAwarenessSetup
) {
	if ( awareness === null ) {
		return;
	}

	for ( const eventType in pendingAwarenessSetup.pendingListeners ) {
		pendingAwarenessSetup.pendingListeners[ eventType ].forEach(
			( listener ): void => {
				awareness.on( eventType, listener );
			}
		);
	}

	for ( const field in pendingAwarenessSetup.pendingStateFields ) {
		const value = pendingAwarenessSetup.pendingStateFields[ field ];
		awareness.setLocalStateField( field, value );
	}

	awareness.emit( 'ready', [ awareness ] );
}
