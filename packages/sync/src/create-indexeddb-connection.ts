/**
 * External dependencies
 */
import { IndexeddbPersistence } from 'y-indexeddb';

/**
 * Internal dependencies
 */
import type { ConnectDoc, Y } from './types';

/**
 * Function that creates a connection to the IndexedDB persistence provider.
 */
export function createIndexedDBConnection(): ConnectDoc {
	return function connectIndexDb(
		objectId: string,
		objectType: string,
		doc: Y.Doc
	) {
		const roomName = `${ objectType }-${ objectId }`;
		const provider = new IndexeddbPersistence( roomName, doc );

		return new Promise( ( resolve ) => {
			provider.on( 'synced', () => {
				resolve( () => provider.destroy() );
			} );
		} );
	};
}
