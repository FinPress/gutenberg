/**
 * External dependencies
 */
// import { WebrtcProvider } from 'y-webrtc';

/**
 * Internal dependencies
 */
import { WebrtcProviderWithHttpSignaling } from './webrtc-http-stream-signaling';
import type {
	ObjectType,
	ObjectID,
	CRDTDoc,
	CreateWebRTCConnectionFn,
	WebRTCConnectionConfig,
} from './types';

/**
 * Function that creates a new WebRTC Connection.
 *
 * @param config           The object ID.
 *
 * @param config.signaling
 * @param config.password
 * @return Promise that resolves when the connection is established.
 */
export function createWebRTCConnection( {
	signaling,
	password,
}: WebRTCConnectionConfig ): CreateWebRTCConnectionFn {
	return function (
		objectId: ObjectID,
		objectType: ObjectType,
		doc: CRDTDoc
	) {
		const roomName = `${ objectType }-${ objectId }`;
		new WebrtcProviderWithHttpSignaling( roomName, doc, {
			signaling,
			password,
		} );

		return Promise.resolve( () => true );
	};
}
