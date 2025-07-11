/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { createDefaultUndoManager } from './default-undo-manager';
import { createSyncUndoManager } from './sync-undo-manager';

export type { UndoManager, HistoryRecord } from './types';

declare global {
	interface Window {
		__experimentalEnableSync?: boolean;
	}
}

/**
 * Creates an instance of the undo manager.
 *
 * Optionally, it can use a sync undo manager if the `core.useSyncUndoManager` filter is set to true.
 *
 * @return An instance of the undo manager.
 */
export function createUndoManager() {
	let useSyncUndoManager = applyFilters( 'core.useSyncUndoManager', false );

	// If collaboration hasn't been enabled, we will use the default undo manager and ignore the filter.
	if ( ! window.__experimentalEnableSync ) {
		useSyncUndoManager = false;
	}

	return useSyncUndoManager
		? createSyncUndoManager()
		: createDefaultUndoManager();
}
