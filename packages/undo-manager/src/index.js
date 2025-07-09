/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { createDefaultUndoManager } from './default-undo-manager';
import { createSyncUndoManager } from './sync-undo-manager';

/** @typedef {import('./types').UndoManager} UndoManager */

export function createUndoManager() {
	const useSyncUndoManager = applyFilters( 'core.useSyncUndoManager', false );

	// eslint-disable-next-line no-console
	console.log(
		`Using ${ useSyncUndoManager ? 'sync' : 'default' } undo manager.`
	);

	return useSyncUndoManager
		? createSyncUndoManager()
		: createDefaultUndoManager();
}
