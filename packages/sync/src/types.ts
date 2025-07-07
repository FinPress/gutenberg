/**
 * External dependencies
 */
import type * as Y from 'yjs';

export type * as Y from 'yjs';
export type ObjectID = string;
export type ObjectType = string;
export type ObjectData = any;
export type UndoManager = Y.UndoManager;

export type ObjectConfig = {
	fetch: ( id: ObjectID ) => Promise< ObjectData >;
	applyChangesToDoc: ( ydoc: Y.Doc, data: any ) => void;
	fromCRDTDoc: ( ydoc: Y.Doc ) => any;
};

export type ConnectDoc = (
	id: ObjectID,
	type: ObjectType,
	ydoc: Y.Doc
) => Promise< () => void >;

export type SyncProvider = {
	addRecord: ( record: any, isStaged?: boolean ) => void;
	clearUndos: () => void;
	clearRedos: () => void;
	undo: () => void;
	redo: () => void;
	canUndo: () => boolean;
	canRedo: () => boolean;
	register: ( type: ObjectType, config: ObjectConfig ) => void;
	bootstrap: (
		type: ObjectType,
		id: ObjectID,
		handleChanges: ( data: any ) => void
	) => Promise< Y.Doc >;
	encodeState: ( type: ObjectType, id: ObjectID ) => Uint8Array | null;
	update: ( type: ObjectType, id: ObjectID, data: any, origin: any ) => void;
	discard: ( type: ObjectType, id: ObjectID ) => Promise< void >;
	postTypeConfigs: { [ postType: string ]: ObjectConfig };
};
