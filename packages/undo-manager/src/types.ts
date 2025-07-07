export type HistoryChange = {
	from: any;
	to: any;
};

export type HistoryChanges = {
	id: string | Record< string, any >;
	changes: Record< string, HistoryChange >;
};

export type HistoryRecord = Array< HistoryChanges >;

export type UndoManager = {
	addRecord: () => void;
	undo: () => HistoryRecord | undefined;
	redo: () => HistoryRecord | undefined;
	hasUndo: () => boolean;
	hasRedo: () => boolean;
};
