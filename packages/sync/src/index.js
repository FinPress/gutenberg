/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { createSyncProvider } from './provider';
export { connectIndexDb } from './connect-indexdb';
export { createWebRTCConnection } from './create-webrtc-connection';
export { createSyncProvider } from './provider';
import { createWebRTCConnection } from './create-webrtc-connection';

/**
 * External dependencies
 */
import * as _Y from 'yjs';
import * as number from 'lib0/number';
import * as buffer from 'lib0/buffer';
import * as string from 'lib0/string';
// @ts-ignore
import * as sha256 from 'lib0/hash/sha256'; // eslint-disable-line import/no-unresolved

export const Y = _Y;

const queryYdocComment =
	/<!-- y:gutenberg version="([a-zA-Z0-9]*)" state="([a-zA-Z0-9+/]*={0,3})" new-content-clientid="([0-9]*)" -->/;

/**
 * @param {string} content
 */
export function extractFromYGutenbergComment( content ) {
	const res = queryYdocComment.exec( content );
	if ( res === null ) {
		// Initial pull of the document. There is currently no y:gutenberg comment present.
		// Generate a consistent new clientid.
		const newClientId = new Uint32Array(
			sha256.digest( string.encodeUtf8( content ) ).buffer
		);
		return {
			startRange: 0,
			endRange: 0,
			version: '1',
			state: Y.encodeStateAsUpdateV2( new Y.Doc() ),
			newClientId,
		};
	}
	const [ , version, state, _newclientid ] = res;
	if ( version !== currentEncodingVersion ) {
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
		// @ts-ignore
		const password = window?.__experimentalCollaborativeEditingSecret;

		// @ts-ignore
		let connectionProvider = applyFilters(
			'core.getConnectionProvider',
			password
		);

		if ( ! connectionProvider ) {
			// Fallback to the default WebRTC connection provider
			connectionProvider = createWebRTCConnection( {
				signaling: [
					// @ts-ignore
					window?.wp?.ajax?.settings?.url,
				],
				password,
			} );
		}

		syncProvider = createSyncProvider(
			null,
			/** @type {import('./types').ConnectDoc | null} */ (
				connectionProvider
			)
		);
	}

	return syncProvider;
}

export const currentEncodingVersion = '1';
