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
export function createSyncUndoManager() {
	return {
		/**
		 * Record changes into the history.
		 *
		 * @param {HistoryRecord=} record   A record of changes to record.
		 * @param {boolean}        isStaged Whether to immediately create an undo point or not.
		 */
		addRecord( record: HistoryRecord, isStaged: boolean = false ) {
			getSyncProvider().addRecord( record, isStaged );
		},

		undo() {
			return getSyncProvider().undo();
		},

		redo() {
			return getSyncProvider().redo();
		},

		hasUndo() {
			return getSyncProvider().canUndo();
		},

		hasRedo() {
			return getSyncProvider().canRedo();
		},
	};
}
