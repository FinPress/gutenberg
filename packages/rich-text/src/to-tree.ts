/**
 * Internal dependencies
 */

import { getActiveFormats } from './get-active-formats';
import { getFormatType } from './get-format-type';
import { OBJECT_REPLACEMENT_CHARACTER, ZWNBSP } from './special-characters';
import type { RichTextValue, RichTextFormat } from './types';

function restoreOnAttributes(
	attributes: Record< string, string >,
	isEditableTree: boolean
): Record< string, string > {
	if ( isEditableTree ) {
		return attributes;
	}

	const newAttributes: Record< string, string > = {};

	for ( const key in attributes ) {
		let newKey = key;
		if ( key.startsWith( 'data-disable-rich-text-' ) ) {
			newKey = key.slice( 'data-disable-rich-text-'.length );
		}

		newAttributes[ newKey ] = attributes[ key ];
	}

	return newAttributes;
}

interface FromFormatOptions {
	type: string;
	tagName?: string;
	attributes?: Record< string, string >;
	unregisteredAttributes?: Record< string, string >;
	object?: boolean;
	boundaryClass?: boolean;
	isEditableTree: boolean;
}

interface FormatElementInfo {
	type: string;
	object?: boolean;
	attributes: Record< string, string >;
}

/**
 * Converts a format object to information that can be used to create an element
 * from (type, attributes and object).
 *
 * @param options                        Named parameters.
 * @param options.type
 * @param options.tagName
 * @param options.attributes
 * @param options.unregisteredAttributes
 * @param options.object
 * @param options.boundaryClass
 * @param options.isEditableTree
 * @return Information to be used for element creation.
 */
function fromFormat( {
	type,
	tagName,
	attributes = {},
	unregisteredAttributes = {},
	object,
	boundaryClass,
	isEditableTree,
}: FromFormatOptions ): FormatElementInfo {
	const formatType = getFormatType( type );

	const elementAttributes: Record< string, string > = {};

	if ( boundaryClass && isEditableTree ) {
		elementAttributes[ 'data-rich-text-format-boundary' ] = 'true';
	}

	if ( ! formatType ) {
		if ( attributes ) {
			Object.assign( elementAttributes, attributes );
		}

		return {
			type,
			attributes: restoreOnAttributes(
				elementAttributes,
				isEditableTree
			),
			object,
		};
	}

	Object.assign( elementAttributes, unregisteredAttributes );

	for ( const name in attributes ) {
		const key = formatType.attributes
			? formatType.attributes[ name ]
			: false;

		if ( key ) {
			elementAttributes[ key ] = attributes[ name ];
		} else {
			elementAttributes[ name ] = attributes[ name ];
		}
	}

	if ( formatType.className ) {
		if ( elementAttributes.class ) {
			elementAttributes.class = `${ formatType.className } ${ elementAttributes.class }`;
		} else {
			elementAttributes.class = formatType.className;
		}
	}

	// When a format is declared as non editable, make it non editable in the
	// editor.
	if ( isEditableTree && formatType.contentEditable === false ) {
		elementAttributes.contenteditable = 'false';
	}

	return {
		type: tagName || formatType.tagName,
		object: formatType.object,
		attributes: restoreOnAttributes( elementAttributes, isEditableTree ),
	};
}

/**
 * Checks if both arrays of formats up until a certain index are equal.
 *
 * @param a     Array of formats to compare.
 * @param b     Array of formats to compare.
 * @param index Index to check until.
 */
function isEqualUntil(
	a: RichTextFormat[],
	b: RichTextFormat[],
	index: number
): boolean {
	do {
		if ( a[ index ] !== b[ index ] ) {
			return false;
		}
	} while ( index-- );

	return true;
}

interface ToTreeOptions {
	value: RichTextValue;
	preserveWhiteSpace?: boolean;
	createEmpty: () => any;
	append: ( parent: any, child: any ) => any;
	getLastChild: ( node: any ) => any;
	getParent: ( node: any ) => any;
	isText: ( node: any ) => boolean;
	getText: ( node: any ) => string;
	remove: ( node: any ) => any;
	appendText: ( node: any, text: string ) => void;
	onStartIndex?: ( tree: any, pointer: any ) => void;
	onEndIndex?: ( tree: any, pointer: any ) => void;
	isEditableTree: boolean;
	placeholder?: string;
}

export function toTree( {
	value,
	preserveWhiteSpace,
	createEmpty,
	append,
	getLastChild,
	getParent,
	isText,
	getText,
	remove,
	appendText,
	onStartIndex,
	onEndIndex,
	isEditableTree,
	placeholder,
}: ToTreeOptions ): any {
	const { formats, replacements, text, start, end } = value;
	const formatsLength = formats.length + 1;
	const tree = createEmpty();
	const activeFormats = getActiveFormats( value );
	const deepestActiveFormat = activeFormats[ activeFormats.length - 1 ];

	let lastCharacterFormats: RichTextFormat[] | undefined;
	let lastCharacter: string | undefined;

	append( tree, '' );

	for ( let i = 0; i < formatsLength; i++ ) {
		const character = text.charAt( i );
		const shouldInsertPadding =
			isEditableTree &&
			// Pad the line if the line is empty.
			( ! lastCharacter ||
				// Pad the line if the previous character is a line break, otherwise
				// the line break won't be visible.
				lastCharacter === '\n' );

		const characterFormats = formats[ i ];
		let pointer = getLastChild( tree );

		if ( characterFormats ) {
			characterFormats.forEach( ( format, formatIndex ) => {
				if (
					pointer &&
					lastCharacterFormats &&
					// Reuse the last element if all formats remain the same.
					isEqualUntil(
						characterFormats,
						lastCharacterFormats,
						formatIndex
					)
				) {
					pointer = getLastChild( pointer );
					return;
				}

				const { type, tagName, attributes, unregisteredAttributes } =
					format;

				const boundaryClass =
					isEditableTree && format === deepestActiveFormat;

				const parent = getParent( pointer );
				const newNode = append(
					parent,
					fromFormat( {
						type,
						tagName,
						attributes,
						unregisteredAttributes,
						object: format.object,
						boundaryClass,
						isEditableTree,
					} )
				);

				if ( isText( pointer ) && getText( pointer ).length === 0 ) {
					remove( pointer );
				}

				pointer = append( newNode, '' );
			} );
		}

		// If there is selection at 0, handle it before characters are inserted.
		if ( i === 0 ) {
			if ( onStartIndex && start === 0 ) {
				onStartIndex( tree, pointer );
			}

			if ( onEndIndex && end === 0 ) {
				onEndIndex( tree, pointer );
			}
		}

		if ( character === OBJECT_REPLACEMENT_CHARACTER ) {
			const replacement = replacements[ i ];
			if ( ! replacement ) {
				continue;
			}
			const { type, attributes, innerHTML } = replacement;
			const formatType = getFormatType( type );

			if ( isEditableTree && type === '#comment' ) {
				pointer = append( getParent( pointer ), {
					type: 'span',
					attributes: {
						contenteditable: 'false',
						'data-rich-text-comment':
							attributes?.[ 'data-rich-text-comment' ],
					},
				} );
				append(
					append( pointer, { type: 'span' } ),
					attributes?.[ 'data-rich-text-comment' ].trim()
				);
			} else if ( ! isEditableTree && type === 'script' ) {
				pointer = append(
					getParent( pointer ),
					fromFormat( {
						type: 'script',
						isEditableTree,
					} )
				);
				append( pointer, {
					html: decodeURIComponent(
						attributes?.[ 'data-rich-text-script' ]
					),
				} );
			} else if ( formatType?.contentEditable === false ) {
				// For non editable formats, render the stored inner HTML.
				pointer = append(
					getParent( pointer ),
					fromFormat( {
						...replacement,
						isEditableTree,
						boundaryClass: start === i && end === i + 1,
					} )
				);

				if ( innerHTML ) {
					append( pointer, {
						html: innerHTML,
					} );
				}
			} else {
				pointer = append(
					getParent( pointer ),
					fromFormat( {
						...replacement,
						object: true,
						isEditableTree,
					} )
				);
			}
			// Ensure pointer is text node.
			pointer = append( getParent( pointer ), '' );
		} else if ( ! preserveWhiteSpace && character === '\n' ) {
			pointer = append( getParent( pointer ), {
				type: 'br',
				attributes: isEditableTree
					? {
							'data-rich-text-line-break': 'true',
					  }
					: undefined,
				object: true,
			} );
			// Ensure pointer is text node.
			pointer = append( getParent( pointer ), '' );
		} else if ( ! isText( pointer ) ) {
			pointer = append( getParent( pointer ), character );
		} else {
			appendText( pointer, character );
		}

		if ( onStartIndex && start === i + 1 ) {
			onStartIndex( tree, pointer );
		}

		if ( onEndIndex && end === i + 1 ) {
			onEndIndex( tree, pointer );
		}

		if ( shouldInsertPadding && i === text.length ) {
			append( getParent( pointer ), ZWNBSP );

			// We CANNOT use CSS to add a placeholder with pseudo elements on
			// the main block wrappers because that could clash with theme CSS.
			if ( placeholder && text.length === 0 ) {
				append( getParent( pointer ), {
					type: 'span',
					attributes: {
						'data-rich-text-placeholder': placeholder,
						// Necessary to prevent the placeholder from catching
						// selection and being editable.
						style: 'pointer-events:none;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;',
					},
				} );
			}
		}

		lastCharacterFormats = characterFormats;
		lastCharacter = character;
	}

	return tree;
}
