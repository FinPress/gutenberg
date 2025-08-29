/**
 * External dependencies
 */
import * as Y from 'yjs';

/**
 * Internal dependencies
 */
import type {
	ObjectType,
	ObjectID,
	ObjectConfig,
	CRDTDoc,
	ConnectDoc,
	SyncProvider,
} from './types';

/**
 * Create a sync provider.
 *
 * @param connectLocal  Connect the document to a local database.
 * @param connectRemote Connect the document to a remote sync connection.
 * @return  Sync provider.
 */
export const createSyncProvider = (
	connectLocal: ConnectDoc,
	connectRemote: ConnectDoc
): SyncProvider => {
	const config: Record< string, ObjectConfig > = {};

	const listeners: Record< string, Record< string, () => void > > = {};

	const docs: Record< string, Record< string, CRDTDoc > > = {};

	/**
	 * Registers an object type.
	 *
	 * @param objectType   Object type to register.
	 * @param objectConfig Object config.
	 */
	function register( objectType: ObjectType, objectConfig: ObjectConfig ) {
		config[ objectType ] = objectConfig;
	}

	/**
	 * Fetch data from local database or remote source.
	 *
	 * @param objectType    Object type to load.
	 * @param objectId      Object ID to load.
	 * @param handleChanges Callback to call when data changes.
	 */
	async function bootstrap(
		objectType: ObjectType,
		objectId: ObjectID,
		handleChanges: Function
	) {
		const doc = new Y.Doc();
		docs[ objectType ] = docs[ objectType ] || {};
		docs[ objectType ][ objectId ] = doc;

		const updateHandler = () => {
			const data = config[ objectType ].fromCRDTDoc( doc );
			handleChanges( data );
		};
		doc.on( 'update', updateHandler );

		// connect to locally saved database.
		const destroyLocalConnection = await connectLocal(
			objectId,
			objectType,
			doc
		);

		// Once the database syncing is done, start the remote syncing
		if ( connectRemote ) {
			await connectRemote( objectId, objectType, doc );
		}

		const loadRemotely = config[ objectType ].fetch;
		if ( loadRemotely ) {
			loadRemotely( objectId ).then( ( data ) => {
				doc.transact( () => {
					config[ objectType ].applyChangesToDoc( doc, data );
				} );
			} );
		}

		listeners[ objectType ] = listeners[ objectType ] || {};
		listeners[ objectType ][ objectId ] = () => {
			destroyLocalConnection();
			doc.off( 'update', updateHandler );
		};
	}

	/**
	 * Fetch data from local database or remote source.
	 *
	 * @param objectType Object type to load.
	 * @param objectId   Object ID to load.
	 * @param data       Updates to make.
	 */
	async function update(
		objectType: ObjectType,
		objectId: ObjectID,
		data: any
	) {
		const doc = docs[ objectType ][ objectId ];
		if ( ! doc ) {
			throw 'Error doc ' + objectType + ' ' + objectId + ' not found';
		}
		doc.transact( () => {
			config[ objectType ].applyChangesToDoc( doc, data );
		} );
	}

	/**
	 * Stop updating a document and discard it.
	 *
	 * @param objectType Object type to load.
	 * @param objectId   Object ID to load.
	 */
	async function discard( objectType: ObjectType, objectId: ObjectID ) {
		if ( listeners?.[ objectType ]?.[ objectId ] ) {
			listeners[ objectType ][ objectId ]();
		}
	}

	return {
		register,
		bootstrap,
		update,
		discard,
	};
};
