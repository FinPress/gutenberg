/**
 * Internal dependencies
 */
import { createSyncProvider } from './provider';
export { connectIndexDb } from './connect-indexdb';
export { createWebRTCConnection } from './create-webrtc-connection';
export { createSyncProvider } from './provider';
// import { createWebRTCConnection } from './create-webrtc-connection';
// import { connectIndexDb } from './connect-indexdb';

/**
 * External dependencies
 */
import * as _Y from 'yjs';
import * as number from 'lib0/number';
import * as buffer from 'lib0/buffer';

export const Y = _Y;

const queryYdocComment =
	/<!-- y:gutenberg version="(.*)" state="([a-zA-Z0-9+/]*={0,3})" new-content-clientid="(.*)" -->/;

/**
 * @param {string} content
 */
export function extractFromYGutenbergComment( content ) {
	const res = queryYdocComment.exec( content );
	if ( res === null ) {
		return null;
	}
	const [ , version, state, _newclientid ] = res;
	if ( version !== '1' ) {
		throw new Error( 'Unexpected y:gutenberg version.' );
	}
	return {
		startRange: res.index,
		endRange: res.index + res[ 0 ].length,
		version,
		state: buffer.fromBase64( state ),
		newClientId: number.parseInt( _newclientid ),
	};
}

/**
 * @type {import('./types').SyncProvider}
 */
let syncProvider;

export function getSyncProvider() {
	if ( ! syncProvider ) {
		syncProvider = createSyncProvider(
			// connectIndexDb,
			null,
			// createWebRTCConnection( {
			// 	signaling: [
			// 		// @ts-ignore
			// 		//'ws://localhost:4444',
			// 		window?.wp?.ajax?.settings?.url,
			// 	],
			// 	// @ts-ignore
			// 	password: window?.__experimentalCollaborativeEditingSecret,
			// } )
			null
		);
	}
	return syncProvider;
}
