/**
 * External dependencies
 */
import memize from 'memize';

export * from './types';

// Type definitions that would typically be in types.ts
export type ShortcodeAttrs = {
	named: Record< string, string >;
	numeric: string[];
};

export type ShortcodeMatch = {
	index: number;
	content: string;
	shortcode: ShortcodeInstance;
};

export type ShortcodeOptions = {
	tag?: string;
	attrs?: string | ShortcodeAttrs | Record< string, string >;
	type?: 'single' | 'self-closing' | 'closed';
	content?: string;
};

export type ReplaceCallback = (
	match: ShortcodeInstance
) => string | undefined;

export type Match = RegExpExecArray | IArguments;

export type ShortcodeInstance = {
	tag: string;
	type: 'single' | 'self-closing' | 'closed';
	content?: string;
	attrs: ShortcodeAttrs;
	get: ( attr: number | string ) => string;
	set: ( attr: number | string, value: string ) => ShortcodeInstance;
	string: () => string;
};

export type ShortcodeConstructor = {
	new ( options?: ShortcodeOptions ): ShortcodeInstance;
	next: typeof next;
	replace: typeof replace;
	string: typeof string;
	regexp: typeof regexp;
	attrs: typeof attrs;
	fromMatch: typeof fromMatch;
};

/**
 * Find the next matching shortcode.
 *
 * @param tag   Shortcode tag.
 * @param text  Text to search.
 * @param index Index to start search from.
 *
 * @return Matched information.
 */
export function next(
	tag: string,
	text: string,
	index = 0
): ShortcodeMatch | undefined {
	const re = regexp( tag );

	re.lastIndex = index;

	const match = re.exec( text );

	if ( ! match ) {
		return;
	}

	// If we matched an escaped shortcode, try again.
	if ( '[' === match[ 1 ] && ']' === match[ 7 ] ) {
		return next( tag, text, re.lastIndex );
	}

	const result: ShortcodeMatch = {
		index: match.index,
		content: match[ 0 ],
		shortcode: fromMatch( match ),
	};

	// If we matched a leading `[`, strip it from the match and increment the
	// index accordingly.
	if ( match[ 1 ] ) {
		result.content = result.content.slice( 1 );
		result.index++;
	}

	// If we matched a trailing `]`, strip it from the match.
	if ( match[ 7 ] ) {
		result.content = result.content.slice( 0, -1 );
	}

	return result;
}

/**
 * Replace matching shortcodes in a block of text.
 *
 * @param tag      Shortcode tag.
 * @param text     Text to search.
 * @param callback Function to process the match and return replacement string.
 *
 * @return Text with shortcodes replaced.
 */
export function replace(
	tag: string,
	text: string,
	callback: ReplaceCallback
): string {
	return text.replace(
		regexp( tag ),
		function ( match, left, $3, attrs, slash, content, closing, right ) {
			// If both extra brackets exist, the shortcode has been properly
			// escaped.
			if ( left === '[' && right === ']' ) {
				return match;
			}

			// Create the match object and pass it through the callback.
			// eslint-disable-next-line prefer-rest-params
			const result = callback( fromMatch( arguments ) );

			// Make sure to return any of the extra brackets if they weren't used to
			// escape the shortcode.
			return result || result === '' ? left + result + right : match;
		}
	);
}

/**
 * Generate a string from shortcode parameters.
 *
 * Creates a shortcode instance and returns a string.
 *
 * Accepts the same `options` as the `shortcode()` constructor, containing a
 * `tag` string, a string or object of `attrs`, a boolean indicating whether to
 * format the shortcode using a `single` tag, and a `content` string.
 *
 * @param options Shortcode options.
 *
 * @return String representation of the shortcode.
 */
export function string( options: ShortcodeOptions ): string {
	return new shortcode( options ).string();
}

/**
 * Generate a RegExp to identify a shortcode.
 *
 * The base regex is functionally equivalent to the one found in
 * `get_shortcode_regex()` in `wp-includes/shortcodes.php`.
 *
 * Capture groups:
 *
 * 1. An extra `[` to allow for escaping shortcodes with double `[[]]`
 * 2. The shortcode name
 * 3. The shortcode argument list
 * 4. The self closing `/`
 * 5. The content of a shortcode when it wraps some content.
 * 6. The closing tag.
 * 7. An extra `]` to allow for escaping shortcodes with double `[[]]`
 *
 * @param tag Shortcode tag.
 *
 * @return Shortcode RegExp.
 */
export function regexp( tag: string ): RegExp {
	return new RegExp(
		'\\[(\\[?)(' +
			tag +
			')(?![\\w-])([^\\]\\/]*(?:\\/(?!\\])[^\\]\\/]*)*?)(?:(\\/)\\]|\\](?:([^\\[]*(?:\\[(?!\\/\\2\\])[^\\[]*)*)(\\[\\/\\2\\]))?)(\\]?)',
		'g'
	);
}

/**
 * Parse shortcode attributes.
 *
 * Shortcodes accept many types of attributes. These can chiefly be divided into
 * named and numeric attributes:
 *
 * Named attributes are assigned on a key/value basis, while numeric attributes
 * are treated as an array.
 *
 * Named attributes can be formatted as either `name="value"`, `name='value'`,
 * or `name=value`. Numeric attributes can be formatted as `"value"` or just
 * `value`.
 *
 * @param text Serialised shortcode attributes.
 *
 * @return Parsed shortcode attributes.
 */
export const attrs = memize( ( text: string ): ShortcodeAttrs => {
	const named: Record< string, string > = {};
	const numeric: string[] = [];

	// This regular expression is reused from `shortcode_parse_atts()` in
	// `wp-includes/shortcodes.php`.
	//
	// Capture groups:
	//
	// 1. An attribute name, that corresponds to...
	// 2. a value in double quotes.
	// 3. An attribute name, that corresponds to...
	// 4. a value in single quotes.
	// 5. An attribute name, that corresponds to...
	// 6. an unquoted value.
	// 7. A numeric attribute in double quotes.
	// 8. A numeric attribute in single quotes.
	// 9. An unquoted numeric attribute.
	const pattern =
		/([\w-]+)\s*=\s*"([^"]*)"(?:\s|$)|([\w-]+)\s*=\s*'([^']*)'(?:\s|$)|([\w-]+)\s*=\s*([^\s'"]+)(?:\s|$)|"([^"]*)"(?:\s|$)|'([^']*)'(?:\s|$)|(\S+)(?:\s|$)/g;

	// Map zero-width spaces to actual spaces.
	text = text.replace( /[\u00a0\u200b]/g, ' ' );

	let match: RegExpExecArray | null;

	// Match and normalize attributes.
	while ( ( match = pattern.exec( text ) ) ) {
		if ( match[ 1 ] ) {
			named[ match[ 1 ].toLowerCase() ] = match[ 2 ];
		} else if ( match[ 3 ] ) {
			named[ match[ 3 ].toLowerCase() ] = match[ 4 ];
		} else if ( match[ 5 ] ) {
			named[ match[ 5 ].toLowerCase() ] = match[ 6 ];
		} else if ( match[ 7 ] ) {
			numeric.push( match[ 7 ] );
		} else if ( match[ 8 ] ) {
			numeric.push( match[ 8 ] );
		} else if ( match[ 9 ] ) {
			numeric.push( match[ 9 ] );
		}
	}

	return { named, numeric };
} );

/**
 * Generate a Shortcode Object from a RegExp match.
 *
 * Accepts a `match` object from calling `regexp.exec()` on a `RegExp` generated
 * by `regexp()`. `match` can also be set to the `arguments` from a callback
 * passed to `regexp.replace()`.
 *
 * @param match Match array.
 *
 * @return Shortcode instance.
 */
export function fromMatch( match: Match ): ShortcodeInstance {
	let type: 'single' | 'self-closing' | 'closed';

	if ( match[ 4 ] ) {
		type = 'self-closing';
	} else if ( match[ 6 ] ) {
		type = 'closed';
	} else {
		type = 'single';
	}

	return new shortcode( {
		tag: match[ 2 ] as string,
		attrs: match[ 3 ] as string,
		type,
		content: match[ 5 ] as string,
	} );
}

/**
 * Creates a shortcode instance.
 *
 * To access a raw representation of a shortcode, pass an `options` object,
 * containing a `tag` string, a string or object of `attrs`, a string indicating
 * the `type` of the shortcode ('single', 'self-closing', or 'closed'), and a
 * `content` string.
 */
const shortcode = Object.assign(
	function (
		this: ShortcodeInstance & { attrs: ShortcodeAttrs },
		options?: ShortcodeOptions
	) {
		const { tag, attrs: attributes, type, content } = options || {};
		Object.assign( this, { tag, type, content } );

		// Ensure we have a correctly formatted `attrs` object.
		this.attrs = {
			named: {},
			numeric: [],
		};

		if ( ! attributes ) {
			return;
		}

		const attributeTypes = [ 'named', 'numeric' ];

		// Parse a string of attributes.
		if ( typeof attributes === 'string' ) {
			this.attrs = attrs( attributes );
			// Identify a correctly formatted `attrs` object.
		} else if (
			Array.isArray( attributes ) &&
			attributes.length === attributeTypes.length &&
			attributeTypes.every( ( t, key ) => t === attributes[ key ] )
		) {
			this.attrs = attributes as ShortcodeAttrs;
			// Handle a flat object of attributes.
		} else {
			Object.entries( attributes ).forEach( ( [ key, value ] ) => {
				this.set( key, value );
			} );
		}
	},
	{
		next,
		replace,
		string,
		regexp,
		attrs,
		fromMatch,
	}
) as unknown as ShortcodeConstructor;

Object.assign( shortcode.prototype, {
	/**
	 * Get a shortcode attribute.
	 *
	 * Automatically detects whether `attr` is named or numeric and routes it
	 * accordingly.
	 *
	 * @param attr Attribute key.
	 *
	 * @return Attribute value.
	 */
	get( attr: number | string ): string {
		// eslint-disable-next-line @typescript-eslint/no-shadow
		const attrs = ( this as ShortcodeInstance & { attrs: ShortcodeAttrs } )
			.attrs; // Ensure correct typing
		const attrsType = typeof attr === 'number' ? 'numeric' : 'named';
		const attrValue = attrs[ attrsType ];
		if ( attrsType === 'numeric' ) {
			if ( Array.isArray( attrValue ) ) {
				return attrValue[ attr as number ];
			}
			return '';
		}
		if ( typeof attrValue === 'object' && attrValue !== null ) {
			if ( typeof attrValue === 'object' && attrValue !== null ) {
				if (
					typeof attrValue === 'object' &&
					! Array.isArray( attrValue )
				) {
					return attrValue[ attr as string ];
				}
				return '';
			}
			return '';
		}
		return '';
	},

	/**
	 * Set a shortcode attribute.
	 *
	 * Automatically detects whether `attr` is named or numeric and routes it
	 * accordingly.
	 *
	 * @param attr  Attribute key.
	 * @param value Attribute value.
	 *
	 * @return Shortcode instance.
	 */
	set( attr: number | string, value: string ): ShortcodeInstance {
		const instance = this as ShortcodeInstance & { attrs: ShortcodeAttrs };
		if ( typeof attr === 'number' ) {
			instance.attrs.numeric[ attr as number ] = value;
		} else {
			instance.attrs.named[ attr as string ] = value;
		}
		return instance;
	},

	/**
	 * Transform the shortcode into a string.
	 *
	 * @return String representation of the shortcode.
	 */
	string(): string {
		let text = '[' + ( this as ShortcodeInstance ).tag;

		( this as ShortcodeInstance ).attrs.numeric.forEach( ( value ) => {
			if ( /\s/.test( value ) ) {
				text += ' "' + value + '"';
			} else {
				text += ' ' + value;
			}
		} );

		const instance = this as ShortcodeInstance & { attrs: ShortcodeAttrs };
		Object.entries( instance.attrs.named ).forEach( ( [ name, value ] ) => {
			text += ' ' + name + '="' + value + '"';
		} );

		// If the tag is marked as `single` or `self-closing`, close the tag and
		// ignore any additional content.
		if ( 'single' === ( this as ShortcodeInstance ).type ) {
			return text + ']';
		} else if ( 'self-closing' === ( this as ShortcodeInstance ).type ) {
			return text + ' /]';
		}

		// Complete the opening tag.
		text += ']';

		if ( ( this as ShortcodeInstance ).content ) {
			text += ( this as ShortcodeInstance ).content;
		}

		// Add the closing tag.
		return text + '[/' + ( this as ShortcodeInstance ).tag + ']';
	},
} );

export default shortcode;
