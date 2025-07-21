/**
 * WordPress dependencies
 */

import {
	escapeEditableHTML,
	escapeAttribute,
	isValidAttributeName,
} from '@wordpress/escape-html';

/**
 * Internal dependencies
 */

import { toTree } from './to-tree';
import type { RichTextValue } from './types';

/**
 * Create an HTML string from a Rich Text value.
 *
 * @param options                    - Named arguments.
 * @param options.value              - Rich text value.
 * @param options.preserveWhiteSpace - Preserves newlines if true.
 *
 * @return HTML string.
 */
export function toHTMLString( {
	value,
	preserveWhiteSpace,
}: {
	value: RichTextValue;
	preserveWhiteSpace?: boolean;
} ): string {
	const tree = toTree( {
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
		onStartIndex: () => {},
		onEndIndex: () => {},
		isEditableTree: false,
		placeholder: '',
	} );

	return createChildrenHTML( tree.children );
}

function createEmpty(): Record< string, any > {
	return {};
}

function getLastChild( { children }: { children?: any[] } ): any {
	return children && children[ children.length - 1 ];
}

function append( parent: any, object: any ): any {
	if ( typeof object === 'string' ) {
		object = { text: object };
	}

	object.parent = parent;
	parent.children = parent.children || [];
	parent.children.push( object );
	return object;
}

function appendText( object: any, text: string ): void {
	object.text += text;
}

function getParent( { parent }: { parent: any } ): any {
	return parent;
}

function isText( { text }: { text: any } ): boolean {
	return typeof text === 'string';
}

function getText( { text }: { text: string } ): string {
	return text;
}

function remove( object: any ): any {
	const index = object.parent.children.indexOf( object );

	if ( index !== -1 ) {
		object.parent.children.splice( index, 1 );
	}

	return object;
}

// interface ElementAttributes {
// 	type: string;
// 	attributes: Record< string, string >;
// 	object?: any;
// 	children?: any[];
// }

function createElementHTML( {
	type,
	attributes,
	object,
	children,
}: Child ): string {
	if ( type === '#comment' ) {
		// We can't restore the original comment delimiters, because once parsed
		// into DOM nodes, we don't have the information. But in the future we
		// could allow comment handlers to specify custom delimiters, for
		// example `</{comment-content}>` for Bits, where `comment-content`
		// would be `/{bit-name}` or `__{translatable-string}` (TBD).
		return `<!--${ attributes[ 'data-rich-text-comment' ] }-->`;
	}

	let attributeString = '';

	for ( const key in attributes ) {
		if ( ! isValidAttributeName( key ) ) {
			continue;
		}

		attributeString += ` ${ key }="${ escapeAttribute(
			attributes[ key ]
		) }"`;
	}

	if ( object ) {
		return `<${ type }${ attributeString }>`;
	}

	return `<${ type }${ attributeString }>${ createChildrenHTML(
		children
	) }</${ type }>`;
}

interface Child {
	html?: string;
	text?: string;
	[ key: string ]: any;
}

function createChildrenHTML( children: Child[] = [] ): string {
	return children
		.map( ( child ) => {
			if ( child.html !== undefined ) {
				return child.html;
			}

			return child.text === undefined
				? createElementHTML( child )
				: escapeEditableHTML( child.text );
		} )
		.join( '' );
}
