/**
 * Internal dependencies
 */
import type { GetRecordsHttpQuery, State } from './selectors';
import type * as ET from './entity-types';

export type WPEntityTypes< C extends ET.Context = 'edit' > = {
	Comment: ET.Comment< C >;
	Media: ET.Attachment< C >;
	Menu: ET.NavMenu< C >;
	MenuItem: ET.NavMenuItem< C >;
	MenuLocation: ET.MenuLocation< C >;
	Plugin: ET.Plugin< C >;
	Post: ET.Post< C >;
	PostRevision: ET.PostRevision< C >;
	PostType: ET.Type< C >;
	Settings: ET.Settings< C >;
	Sidebar: ET.Sidebar< C >;
	Status: ET.PostStatusObject< C >;
	Taxonomy: ET.Taxonomy< C >;
	Theme: ET.Theme< C >;
	UnstableBase: ET.Base< C >;
	User: ET.User< C >;
	Widget: ET.Widget< C >;
	WidgetType: ET.WidgetType< C >;
};

/**
 * A simple utility that pluralizes a string.
 * Converts:
 * - "post" to "posts"
 * - "taxonomy" to "taxonomies"
 * - "media" to "mediaItems"
 */
type PluralizeEntity< T extends string > = T extends 'Media'
	? 'MediaItems'
	: T extends `${ infer U }y`
	? `${ U }ies`
	: `${ T }s`;

/**
 * A simple utility that singularizes a string.
 *
 * Converts:
 * - "posts" to "post"
 * - "taxonomies" to "taxonomy"
 * - "mediaItems" to "media"
 */
type SingularizeEntity< T extends string > = T extends 'MediaItems'
	? 'Media'
	: T extends `${ infer U }ies`
	? `${ U }y`
	: T extends `${ infer U }s`
	? U
	: T;

export type SingularGetters = {
	[ Key in `get${ keyof WPEntityTypes }` ]: (
		state: State,
		id: number | string,
		query?: GetRecordsHttpQuery
	) => WPEntityTypes[ Key extends `get${ infer E }` ? E : never ] | undefined;
};

export type PluralGetters = {
	[ Key in `get${ PluralizeEntity< keyof WPEntityTypes > }` ]: (
		state: State,
		query?: GetRecordsHttpQuery
	) => Array<
		WPEntityTypes[ Key extends `get${ infer E }`
			? SingularizeEntity< E >
			: never ]
	> | null;
};

type ActionOptions = {
	throwOnError?: boolean;
};

type DeleteRecordsHttpQuery = Record< string, any >;

export type SaveActions = {
	[ Key in `save${ keyof WPEntityTypes }` ]: (
		data: Partial<
			WPEntityTypes[ Key extends `save${ infer E }` ? E : never ]
		>,
		options?: ActionOptions
	) => Promise< void >;
};

export type DeleteActions = {
	[ Key in `delete${ keyof WPEntityTypes }` ]: (
		id: number | string,
		query?: DeleteRecordsHttpQuery,
		options?: ActionOptions
	) => Promise< void >;
};

export let dynamicActions: SaveActions & DeleteActions;

export let dynamicSelectors: SingularGetters & PluralGetters;
