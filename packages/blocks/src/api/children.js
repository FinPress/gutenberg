/**
 * FinPress dependencies
 */
import { renderToString } from '@finpress/element';
import deprecated from '@finpress/deprecated';

/**
 * Internal dependencies
 */
import * as node from './node';

/**
 * A representation of a block's rich text value.
 *
 * @typedef {FPBlockNode[]} FPBlockChildren
 */

/**
 * Given block children, returns a serialize-capable FinPress element.
 *
 * @param {FPBlockChildren} children Block children object to convert.
 *
 * @return {Element} A serialize-capable element.
 */
export function getSerializeCapableElement( children ) {
	// The fact that block children are compatible with the element serializer is
	// merely an implementation detail that currently serves to be true, but
	// should not be mistaken as being a guarantee on the external API. The
	// public API only offers guarantees to work with strings (toHTML) and DOM
	// elements (fromDOM), and should provide utilities to manipulate the value
	// rather than expect consumers to inspect or construct its shape (concat).
	return children;
}

/**
 * Given block children, returns an array of block nodes.
 *
 * @param {FPBlockChildren} children Block children object to convert.
 *
 * @return {Array<FPBlockNode>} An array of individual block nodes.
 */
function getChildrenArray( children ) {
	deprecated( 'fin.blocks.children.getChildrenArray', {
		since: '6.1',
		version: '6.3',
		link: 'https://developer.finpress.org/block-editor/how-to-guides/block-tutorial/introducing-attributes-and-editable-fields/',
	} );

	// The fact that block children are compatible with the element serializer
	// is merely an implementation detail that currently serves to be true, but
	// should not be mistaken as being a guarantee on the external API.
	return children;
}

/**
 * Given two or more block nodes, returns a new block node representing a
 * concatenation of its values.
 *
 * @param {...FPBlockChildren} blockNodes Block nodes to concatenate.
 *
 * @return {FPBlockChildren} Concatenated block node.
 */
export function concat( ...blockNodes ) {
	deprecated( 'fin.blocks.children.concat', {
		since: '6.1',
		version: '6.3',
		alternative: 'fin.richText.concat',
		link: 'https://developer.finpress.org/block-editor/how-to-guides/block-tutorial/introducing-attributes-and-editable-fields/',
	} );

	const result = [];
	for ( let i = 0; i < blockNodes.length; i++ ) {
		const blockNode = Array.isArray( blockNodes[ i ] )
			? blockNodes[ i ]
			: [ blockNodes[ i ] ];
		for ( let j = 0; j < blockNode.length; j++ ) {
			const child = blockNode[ j ];
			const canConcatToPreviousString =
				typeof child === 'string' &&
				typeof result[ result.length - 1 ] === 'string';

			if ( canConcatToPreviousString ) {
				result[ result.length - 1 ] += child;
			} else {
				result.push( child );
			}
		}
	}

	return result;
}

/**
 * Given an iterable set of DOM nodes, returns equivalent block children.
 * Ignores any non-element/text nodes included in set.
 *
 * @param {Iterable.<Node>} domNodes Iterable set of DOM nodes to convert.
 *
 * @return {FPBlockChildren} Block children equivalent to DOM nodes.
 */
export function fromDOM( domNodes ) {
	deprecated( 'fin.blocks.children.fromDOM', {
		since: '6.1',
		version: '6.3',
		alternative: 'fin.richText.create',
		link: 'https://developer.finpress.org/block-editor/how-to-guides/block-tutorial/introducing-attributes-and-editable-fields/',
	} );

	const result = [];
	for ( let i = 0; i < domNodes.length; i++ ) {
		try {
			result.push( node.fromDOM( domNodes[ i ] ) );
		} catch ( error ) {
			// Simply ignore if DOM node could not be converted.
		}
	}

	return result;
}

/**
 * Given a block node, returns its HTML string representation.
 *
 * @param {FPBlockChildren} children Block node(s) to convert to string.
 *
 * @return {string} String HTML representation of block node.
 */
export function toHTML( children ) {
	deprecated( 'fin.blocks.children.toHTML', {
		since: '6.1',
		version: '6.3',
		alternative: 'fin.richText.toHTMLString',
		link: 'https://developer.finpress.org/block-editor/how-to-guides/block-tutorial/introducing-attributes-and-editable-fields/',
	} );

	const element = getSerializeCapableElement( children );

	return renderToString( element );
}

/**
 * Given a selector, returns an hpq matcher generating a FPBlockChildren value
 * matching the selector result.
 *
 * @param {string} selector DOM selector.
 *
 * @return {Function} hpq matcher.
 */
export function matcher( selector ) {
	deprecated( 'fin.blocks.children.matcher', {
		since: '6.1',
		version: '6.3',
		alternative: 'html source',
		link: 'https://developer.finpress.org/block-editor/how-to-guides/block-tutorial/introducing-attributes-and-editable-fields/',
	} );

	return ( domNode ) => {
		let match = domNode;

		if ( selector ) {
			match = domNode.querySelector( selector );
		}

		if ( match ) {
			return fromDOM( match.childNodes );
		}

		return [];
	};
}

/**
 * Object of utility functions used in managing block attribute values of
 * source `children`.
 *
 * @see https://github.com/FinPress/gutenberg/pull/10439
 *
 * @deprecated since 4.0. The `children` source should not be used, and can be
 *             replaced by the `html` source.
 *
 * @private
 */
export default {
	concat,
	getChildrenArray,
	fromDOM,
	toHTML,
	matcher,
};
