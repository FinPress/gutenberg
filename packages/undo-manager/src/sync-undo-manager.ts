/**
 * WordPress dependencies
 */
import { getSyncProvider } from '@wordpress/sync';

/**
 * Internal dependencies
 */
import type { UndoManager, HistoryRecord } from './types';

/**
 * Creates the sync powered undo manager.
 *
 * @return {UndoManager} Undo manager.
 */
export function createSyncUndoManager(): UndoManager {
	const syncProvider = getSyncProvider();

	return {
		/**
		 * Record changes into the history.
		 *
		 * @param {HistoryRecord} record   A record of changes to record.
		 * @param {boolean}       isStaged Whether to immediately create an undo point or not.
		 */
		addRecord( record: HistoryRecord, isStaged: boolean = false ) {
			syncProvider.addRecord( record, isStaged );
		},

		undo() {
			return syncProvider.undo();
		},

		redo() {
			return syncProvider.redo();
		},

		hasUndo() {
			return syncProvider.canUndo();
		},

		hasRedo() {
			return syncProvider.canRedo();
		},
	};
}
