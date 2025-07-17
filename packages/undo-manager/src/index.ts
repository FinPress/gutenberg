/**
 * WordPress dependencies
 */
import isShallowEqual from '@wordpress/is-shallow-equal';

/**
 * Represents a single change in history.
 */
export interface HistoryChange {
	/** The previous value */
	from: unknown;
	/** The new value */
	to: unknown;
}

/**
 * Represents changes for a single item.
 */
export interface HistoryChanges {
	/** The identifier for the item being changed */
	id: string | Record< string, unknown >;
	/** The changes made to the item */
	changes: Record< string, HistoryChange >;
}

/**
 * Represents a record of history changes.
 */
export type HistoryRecord = HistoryChanges[];

/**
 * The undo manager interface.
 */
export interface UndoManager {
	/**
	 * Record changes into the history.
	 *
	 * @param record   A record of changes to record.
	 * @param isStaged Whether to immediately create an undo point or not.
	 */
	addRecord: ( record?: HistoryRecord, isStaged?: boolean ) => void;

	/**
	 * Undo the last recorded changes.
	 *
	 * @return The undone record or undefined if nothing to undo.
	 */
	undo: () => HistoryRecord | undefined;

	/**
	 * Redo the last undone changes.
	 *
	 * @return The redone record or undefined if nothing to redo.
	 */
	redo: () => HistoryRecord | undefined;

	/**
	 * Check if there are changes that can be undone.
	 *
	 * @return Whether there are changes to undo.
	 */
	hasUndo: () => boolean;

	/**
	 * Check if there are changes that can be redone.
	 *
	 * @return Whether there are changes to redo.
	 */
	hasRedo: () => boolean;
}

/**
 * Merge changes for a single item into a record of changes.
 *
 * @param changes1 Previous changes
 * @param changes2 Next changes
 *
 * @return Merged changes
 */
function mergeHistoryChanges(
	changes1: Record< string, HistoryChange >,
	changes2: Record< string, HistoryChange >
): Record< string, HistoryChange > {
	const newChanges: Record< string, HistoryChange > = { ...changes1 };
	Object.entries( changes2 ).forEach( ( [ key, value ] ) => {
		if ( newChanges[ key ] ) {
			newChanges[ key ] = { ...newChanges[ key ], to: value.to };
		} else {
			newChanges[ key ] = value;
		}
	} );

	return newChanges;
}

/**
 * Adds history changes for a single item into a record of changes.
 *
 * @param record  The record to merge into.
 * @param changes The changes to merge.
 */
const addHistoryChangesIntoRecord = (
	record: HistoryRecord,
	changes: HistoryChanges
): HistoryRecord => {
	const existingChangesIndex = record?.findIndex(
		( { id: recordIdentifier } ) => {
			return typeof recordIdentifier === 'string'
				? recordIdentifier === changes.id
				: isShallowEqual( recordIdentifier, changes.id );
		}
	);
	const nextRecord = [ ...record ];

	if ( existingChangesIndex !== -1 ) {
		// If the edit is already in the stack leave the initial "from" value.
		nextRecord[ existingChangesIndex ] = {
			id: changes.id,
			changes: mergeHistoryChanges(
				nextRecord[ existingChangesIndex ].changes,
				changes.changes
			),
		};
	} else {
		nextRecord.push( changes );
	}
	return nextRecord;
};

/**
 * Creates an undo manager.
 *
 * @return Undo manager.
 */
export function createUndoManager(): UndoManager {
	let history: HistoryRecord[] = [];
	let stagedRecord: HistoryRecord = [];
	let offset = 0;

	const dropPendingRedos = (): void => {
		history = history.slice( 0, offset || undefined );
		offset = 0;
	};

	const appendStagedRecordToLatestHistoryRecord = (): void => {
		const index = history.length === 0 ? 0 : history.length - 1;
		let latestRecord = history[ index ] ?? [];
		stagedRecord.forEach( ( changes ) => {
			latestRecord = addHistoryChangesIntoRecord( latestRecord, changes );
		} );
		stagedRecord = [];
		history[ index ] = latestRecord;
	};

	/**
	 * Checks whether a record is empty.
	 * A record is considered empty if it the changes keep the same values.
	 * Also updates to function values are ignored.
	 *
	 * @param record The record to check.
	 * @return Whether the record is empty.
	 */
	const isRecordEmpty = ( record: HistoryRecord ): boolean => {
		const filteredRecord = record.filter( ( { changes } ) => {
			return Object.values( changes ).some(
				( { from, to } ) =>
					typeof from !== 'function' &&
					typeof to !== 'function' &&
					! isShallowEqual( from, to )
			);
		} );
		return ! filteredRecord.length;
	};

	return {
		addRecord( record?: HistoryRecord, isStaged = false ): void {
			const isEmpty = ! record || isRecordEmpty( record );
			if ( isStaged ) {
				if ( isEmpty ) {
					return;
				}
				record.forEach( ( changes ) => {
					stagedRecord = addHistoryChangesIntoRecord(
						stagedRecord,
						changes
					);
				} );
			} else {
				dropPendingRedos();
				if ( stagedRecord.length ) {
					appendStagedRecordToLatestHistoryRecord();
				}
				if ( isEmpty ) {
					return;
				}
				history.push( record );
			}
		},

		undo(): HistoryRecord | undefined {
			if ( stagedRecord.length ) {
				dropPendingRedos();
				appendStagedRecordToLatestHistoryRecord();
			}
			const undoRecord = history[ history.length - 1 + offset ];
			if ( ! undoRecord ) {
				return;
			}
			offset -= 1;
			return undoRecord;
		},

		redo(): HistoryRecord | undefined {
			const redoRecord = history[ history.length + offset ];
			if ( ! redoRecord ) {
				return;
			}
			offset += 1;
			return redoRecord;
		},

		hasUndo(): boolean {
			return !! history[ history.length - 1 + offset ];
		},

		hasRedo(): boolean {
			return !! history[ history.length + offset ];
		},
	};
}
