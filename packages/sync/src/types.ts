/**
 * External dependencies
 */
import type { Awareness } from 'y-protocols/awareness';
import type * as Y from 'yjs';

export type * as Y from 'yjs';
export type ObjectID = string;
export type ObjectType = string;
export type ObjectData = any;

export type ObjectConfig = {
	fetch: ( id: ObjectID ) => Promise< ObjectData >;
	applyChangesToDoc: ( ydoc: Y.Doc, data: any ) => void;
	fromCRDTDoc: ( ydoc: Y.Doc ) => any;
};

export type ConnectDocResult = {
	destroy: () => void;
	awareness: Awareness | null;
};

export type ConnectDoc = (
	id: ObjectID,
	type: ObjectType,
	ydoc: Y.Doc
) => Promise< ConnectDocResult >;

export type AwarenessEventListener = ( params: {
	added: number[];
	updated: number[];
	removed: number[];
} ) => void;

export interface PendingAwarenessSetup {
	pendingListeners: Record< string, AwarenessEventListener[] >;
	pendingStateFields: Record< string, any >;
}

export type SyncProvider = {
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

	awareness: {
		addListener: (
			eventType: 'update' | 'change',
			listener: AwarenessEventListener
		) => void;
		getStates: () => Map< number, Record< string, any > > | null;
		setLocalStateField: ( field: string, value: any ) => void;
		removeAwarenessStates: () => void;
	};
};
