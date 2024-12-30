/**
 * Internal dependencies
 */
import { createSyncProvider } from './provider';
export { connectIndexDb } from './connect-indexdb';
export { createWebRTCConnection } from './create-webrtc-connection';
export { createSyncProvider } from './provider';
import { createWebRTCConnection } from './create-webrtc-connection';
// import { connectIndexDb } from './connect-indexdb';

/**
 * External dependencies
 */
import * as _Y from 'yjs';

export const Y = _Y;

/**
 * @type {import('./types').SyncProvider}
 */
let syncProvider;

export function getSyncProvider() {
	if ( ! syncProvider ) {
		syncProvider = createSyncProvider(
			// connectIndexDb,
			null,
			createWebRTCConnection( {
				signaling: [
					// @ts-ignore
					//'ws://localhost:4444',
					window?.wp?.ajax?.settings?.url,
				],
				// @ts-ignore
				password: window?.__experimentalCollaborativeEditingSecret,
			} )
			// null
		);
	}
	return syncProvider;
}
