/**
 * WordPress dependencies
 */
import { getSyncProvider } from '@wordpress/sync';

/** @typedef {import('./types').HistoryRecord}  HistoryRecord */
/** @typedef {import('./types').HistoryChange}  HistoryChange */
/** @typedef {import('./types').HistoryChanges} HistoryChanges */
/** @typedef {import('./types').UndoManager} UndoManager */

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
		// eslint-disable-next-line no-unused-vars
		addRecord( record, isStaged = false ) {
			getSyncProvider().addRecord();
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
