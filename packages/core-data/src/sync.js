/**
 * This export lives here because @wordpress/sync is included multiple times in a bundle when we
 * import it from different sources (build/blocks bundles @wordpress/sync, build/core-data bundles a
 * duplicate of @wordpress/sync).
 */

export {
	createSyncProvider,
	createWebRTCConnection,
	connectIndexDb,
	Y,
	getSyncProvider,
} from '@wordpress/sync';
// // export * as Y from '@wordpress/sync'
//
// export const Y = _Y
//
//
// /**
//  * @type {import('./types').SyncProvider}
//  */
// let syncProvider;
//
// export function getSyncProvider() {
// 	if (syncProvider == null) {
// 		console.log('created sync provider')
// 		syncProvider = createSyncProvider(
// 			connectIndexDb,
// 			createWebRTCConnection( {
// 				signaling: [
// 					// @ts-ignore
// 					//'ws://localhost:4444',
// 					window?.wp?.ajax?.settings?.url,
// 				],
// 				// @ts-ignore
// 				password: window?.__experimentalCollaborativeEditingSecret,
// 			} )
// 		)
// 	}
// 	return syncProvider;
// }
//
