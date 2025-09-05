/**
 * FinPress dependencies
 */
import {
	createSyncProvider,
	connectIndexDb,
	createWebRTCConnection,
} from '@finpress/sync';

let syncProvider;

export function getSyncProvider() {
	if ( ! syncProvider ) {
		syncProvider = createSyncProvider(
			connectIndexDb,
			createWebRTCConnection( {
				signaling: [
					//'ws://localhost:4444',
					window?.fp?.ajax?.settings?.url,
				],
				password: window?.__experimentalCollaborativeEditingSecret,
			} )
		);
	}

	return syncProvider;
}
