/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import { WebrtcProviderWithHttpSignaling } from './webrtc-http-stream-signaling';
import type { ConnectDoc, Y } from './types';

type WebrtcProviderConstructorArgs = ConstructorParameters<
	typeof WebrtcProviderWithHttpSignaling
>;

interface WebrtcConnectionConfig {
	options: WebrtcProviderConstructorArgs[ 2 ];
}

/**
 * Function that creates a new WebRTC connection.
 *
 * @param {WebrtcConnectionConfig} config The configuration for the WebSocket connection.
 * @return {ConnectDoc} A function that connects a Y.Doc to a WebRTC endpoint.
 */
export function createWebRTCConnection(
	config: WebrtcConnectionConfig
): ConnectDoc {
	return async function ( objectId: string, objectType: string, doc: Y.Doc ) {
		const roomName = `${ objectType }-${ objectId }`;
		const options = {
			password:
				// @ts-ignore
				window?.__experimentalCollaborativeEditingSecret as string,
			...config.options,
		};

		try {
			new WebrtcProviderWithHttpSignaling( roomName, doc, options );
		} catch {}

		return () => {
			// The WebrtcProvider handles its own cleanup. If needed, we could
			// implement a way to disconnect or clean up resources here.
		};
	};
}
