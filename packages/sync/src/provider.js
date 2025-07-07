/**
 * WordPress dependencies
 */

/**
 * External dependencies
 */
// @ts-ignore
import { removeAwarenessStates as removeAwarenessStatesFromProtocol } from 'y-protocols/awareness';
import * as Y from 'yjs';

/** @typedef {import('./types').ObjectType} ObjectType */
/** @typedef {import('./types').ObjectID} ObjectID */
/** @typedef {import('./types').ObjectConfig} ObjectConfig */
/** @typedef {import('./types').ConnectDoc} ConnectDoc */
/** @typedef {import('./types').SyncProvider} SyncProvider */
/** @typedef {import('./types').AwarenessEventListener} AwarenessEventListener */
/** @typedef {import('./types').PendingAwarenessSetup} PendingAwarenessSetup */
/** @typedef {import('y-protocols/awareness').Awareness} Awareness */

const AWARENESS_DOC_TYPE = 'postType/Posts';

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
	 * @type {Record<string,Record<string,{ ydoc: Y.Doc, prevContentClientId: number, destroy: ()=>void, awareness: Awareness | null }>>}
	 */
	const docs = {};

	/**
	 * @type {PendingAwarenessSetup}
	 */
	const pendingAwarenessSetup = {
		pendingListeners: {
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

	// Awareness handlers

	/**
	 * Add a listener for awareness events.
	 *
	 * @param {'update'|'change'}      eventType              Event type.
	 * @param {AwarenessEventListener} awarenessEventListener Awareness event listener.
	 */
	function addListener( eventType, awarenessEventListener ) {
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
	function setLocalStateField( field, value ) {
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
	function getStates() {
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

	return {
		register,
		bootstrap,
		update,
		encodeState,
		discard,
		postTypeConfigs,

		awareness: {
			addListener,
			getStates,
			setLocalStateField,
			removeAwarenessStates,
		},
	};
};

/**
 * @param {Awareness}             awareness             Awareness.
 * @param {PendingAwarenessSetup} pendingAwarenessSetup Pending listeners.
 */
async function bootstrapAwareness( awareness, pendingAwarenessSetup ) {
	if ( awareness === null ) {
		return;
	}

	for ( const eventType in pendingAwarenessSetup.pendingListeners ) {
		pendingAwarenessSetup.pendingListeners[ eventType ].forEach(
			/** @type {(listener: AwarenessEventListener) => void} */ (
				listener
			) => {
				awareness.on( eventType, listener );
			}
		);
	}

	for ( const field in pendingAwarenessSetup.pendingStateFields ) {
		const value = pendingAwarenessSetup.pendingStateFields[ field ];
		awareness.setLocalStateField( field, value );
	}
}
