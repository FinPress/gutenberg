/**
 * Internal dependencies
 */
import type Shortcode from './index';

/**
 * Shortcode attributes object.
 */
export type ShortcodeAttrs = {
	/**
	 * Object with named attributes.
	 */
	named: Record< string, string | undefined >;

	/**
	 * Array with numeric attributes.
	 */
	numeric: string[];
};

export type ShortcodeMatch = {
	/**
	 * Index the shortcode is found at.
	 */
	index: number;

	/**
	 * Matched content.
	 */
	content: string;

	/**
	 * Shortcode instance of the match.
	 */
	shortcode: Shortcode;
};

/**
 * Shortcode options.
 */
export interface ShortcodeOptions {
	/**
	 * Shortcode tag.
	 */
	tag: string;

	/**
	 * Shortcode attributes.
	 */
	attrs?:
		| Partial< ShortcodeAttrs >
		| ( ShortcodeAttrs[ 'named' ] &
				Record< number, ShortcodeAttrs[ 'numeric' ] > )
		| string;

	/**
	 * Shortcode content.
	 */
	content?: string;

	/**
	 * Shortcode type: `self-closing`, `closed`, or `single`.
	 */
	type?: 'self-closing' | 'closed' | 'single';
}

export type Match =
	| NonNullable< ReturnType< RegExp[ 'exec' ] > >
	| Array< string >;

export type ReplaceCallback = ( shortcode: Shortcode ) => any;
