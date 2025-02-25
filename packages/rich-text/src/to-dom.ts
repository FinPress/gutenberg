/**
 * Internal dependencies
 */

import { toTree } from './to-tree';
import { createElement } from './create-element';
import { isRangeEqual } from './is-range-equal';
import type { RichTextValue } from './types';

/**
 * Creates a path as an array of indices from the given root node to the given
 * node.
 *
 * @param node     Node to find the path of.
 * @param rootNode Root node to find the path from.
 * @param path     Initial path to build on.
 *
 * @return The path from the root node to the node.
 */
function createPathToNode(
	node: Node,
	rootNode: HTMLElement,
	path: number[]
): number[] {
	const parentNode = node.parentNode;
	let i = 0;

	while ( ( node = node.previousSibling as Node ) ) {
		i++;
	}

	path = [ i, ...path ];

	if ( parentNode !== rootNode ) {
		path = createPathToNode( parentNode as Node, rootNode, path );
	}

	return path;
}

/**
 * Gets a node given a path (array of indices) from the given node.
 *
 * @param node Root node to find the wanted node in.
 * @param path Path (indices) to the wanted node.
 *
 * @return Object with the found node and the remaining offset (if any).
 */
function getNodeByPath(
	node: HTMLElement,
	path: number[]
): { node: Node; offset: number } {
	path = [ ...path ];

	while ( node && path.length > 1 ) {
		node = node.childNodes[ path.shift() as number ] as HTMLElement;
	}

	return {
		node,
		offset: path[ 0 ],
	};
}

interface Child {
	html?: string;
	type?: string;
	attributes?: Record< string, string >;
	[ key: string ]: any;
}

function append( element: HTMLElement, child: Child | string ): Node {
	if ( typeof child === 'object' && child.html !== undefined ) {
		element.innerHTML += child.html;
		return element.lastChild as Node;
	}

	if ( typeof child === 'string' ) {
		child = element.ownerDocument.createTextNode( child );
		return element.appendChild( child as Node );
	}

	const { type, attributes } = child;

	if ( type ) {
		let node: Node;
		if ( type === '#comment' ) {
			node = element.ownerDocument.createComment(
				attributes?.[ 'data-rich-text-comment' ] || ''
			);
		} else {
			node = element.ownerDocument.createElement( type );

			if ( attributes ) {
				for ( const key in attributes ) {
					( node as HTMLElement ).setAttribute(
						key,
						attributes[ key ]
					);
				}
			}
		}
		return element.appendChild( node );
	}

	return element.appendChild( child as Node );
}

function appendText( node: Text, text: string ): void {
	node.appendData( text );
}

function getLastChild( { lastChild }: { lastChild: Node } ): Node | null {
	return lastChild;
}

function getParent( { parentNode }: { parentNode: Node } ): Node | null {
	return parentNode;
}

function isText( node: Node ): boolean {
	return node.nodeType === node.TEXT_NODE;
}

function getText( { nodeValue }: { nodeValue: string } ): string {
	return nodeValue;
}

function remove( node: Node ): Node {
	return node.parentNode?.removeChild( node ) as Node;
}

interface ToDomOptions {
	value: RichTextValue;
	prepareEditableTree?: ( value: RichTextValue ) => any[];
	isEditableTree?: boolean;
	placeholder?: string;
	doc?: Document;
}

interface ToDomResult {
	body: HTMLElement;
	selection: {
		startPath: number[];
		endPath: number[];
	};
}

export function toDom( {
	value,
	prepareEditableTree,
	isEditableTree = true,
	placeholder,
	doc = document,
}: ToDomOptions ): ToDomResult {
	let startPath: number[] = [];
	let endPath: number[] = [];

	if ( prepareEditableTree ) {
		value = {
			...value,
			formats: prepareEditableTree( value ),
		};
	}

	/**
	 * Returns a new instance of a DOM tree upon which RichText operations can be
	 * applied.
	 *
	 * Note: The current implementation will return a shared reference, reset on
	 * each call to `createEmpty`. Therefore, you should not hold a reference to
	 * the value to operate upon asynchronously, as it may have unexpected results.
	 *
	 * @return RichText tree.
	 */
	const createEmpty = (): HTMLElement => createElement( doc, '' );

	const tree = toTree( {
		value,
		createEmpty,
		append,
		getLastChild,
		getParent,
		isText,
		getText,
		remove,
		appendText,
		onStartIndex( body: HTMLElement, pointer: Text ) {
			startPath = createPathToNode( pointer, body, [
				pointer.nodeValue?.length || 0,
			] );
		},
		onEndIndex( body: HTMLElement, pointer: Text ) {
			endPath = createPathToNode( pointer, body, [
				pointer.nodeValue?.length || 0,
			] );
		},
		isEditableTree,
		placeholder,
	} );

	return {
		body: tree,
		selection: { startPath, endPath },
	};
}

interface ApplyOptions {
	value: RichTextValue;
	current: HTMLElement;
	prepareEditableTree?: ( value: RichTextValue ) => any[];
	__unstableDomOnly?: boolean;
	placeholder?: string;
}

/**
 * Create an `Element` tree from a Rich Text value and applies the difference to
 * the `Element` tree contained by `current`.
 *
 * @param options                     Named arguments.
 * @param options.value
 * @param options.current
 * @param options.prepareEditableTree
 * @param options.__unstableDomOnly
 * @param options.placeholder
 */
export function apply( {
	value,
	current,
	prepareEditableTree,
	__unstableDomOnly,
	placeholder,
}: ApplyOptions ): void {
	// Construct a new element tree in memory.
	const { body, selection } = toDom( {
		value,
		prepareEditableTree,
		placeholder,
		doc: current.ownerDocument,
	} );

	applyValue( body, current );

	if ( value.start !== undefined && ! __unstableDomOnly ) {
		applySelection( selection, current );
	}
}

export function applyValue( future: HTMLElement, current: HTMLElement ): void {
	let i = 0;
	let futureChild: Node | null;

	while ( ( futureChild = future.firstChild ) ) {
		const currentChild = current.childNodes[ i ];

		if ( ! currentChild ) {
			current.appendChild( futureChild );
		} else if ( ! currentChild.isEqualNode( futureChild ) ) {
			if (
				currentChild.nodeName !== futureChild.nodeName ||
				( currentChild.nodeType === currentChild.TEXT_NODE &&
					( currentChild as Text ).data !==
						( futureChild as Text ).data )
			) {
				current.replaceChild( futureChild, currentChild );
			} else {
				const currentAttributes = ( currentChild as Element )
					.attributes;
				const futureAttributes = ( futureChild as Element ).attributes;

				if ( currentAttributes ) {
					let ii = currentAttributes.length;

					// Reverse loop because `removeAttribute` on `currentChild`
					// changes `currentAttributes`.
					while ( ii-- ) {
						const { name } = currentAttributes[ ii ];

						if (
							! ( futureChild as Element ).getAttribute( name )
						) {
							( currentChild as Element ).removeAttribute( name );
						}
					}
				}

				if ( futureAttributes ) {
					for ( let ii = 0; ii < futureAttributes.length; ii++ ) {
						const { name, value } = futureAttributes[ ii ];

						if (
							( currentChild as Element ).getAttribute( name ) !==
							value
						) {
							( currentChild as Element ).setAttribute(
								name,
								value
							);
						}
					}
				}

				applyValue(
					futureChild as HTMLElement,
					currentChild as HTMLElement
				);
				future.removeChild( futureChild );
			}
		} else {
			future.removeChild( futureChild );
		}

		i++;
	}

	while ( current.childNodes[ i ] ) {
		current.removeChild( current.childNodes[ i ] );
	}
}

export function applySelection(
	{ startPath, endPath }: { startPath: number[]; endPath: number[] },
	current: HTMLElement
): void {
	const { node: startContainer, offset: startOffset } = getNodeByPath(
		current,
		startPath
	);
	const { node: endContainer, offset: endOffset } = getNodeByPath(
		current,
		endPath
	);
	const { ownerDocument } = current;
	const { defaultView } = ownerDocument;

	if ( ! defaultView ) {
		return;
	}

	const selection = defaultView.getSelection();

	if ( ! selection ) {
		return;
	}

	const range = ownerDocument.createRange();

	range.setStart( startContainer, startOffset );
	range.setEnd( endContainer, endOffset );

	const { activeElement } = ownerDocument;

	if ( selection.rangeCount > 0 ) {
		// If the to be added range and the live range are the same, there's no
		// need to remove the live range and add the equivalent range.
		if ( isRangeEqual( range, selection.getRangeAt( 0 ) ) ) {
			return;
		}

		selection.removeAllRanges();
	}

	selection.addRange( range );

	// This function is not intended to cause a shift in focus. Since the above
	// selection manipulations may shift focus, ensure that focus is restored to
	// its previous state.
	if ( activeElement !== ownerDocument.activeElement ) {
		// The `instanceof` checks protect against edge cases where the focused
		// element is not of the interface HTMLElement (does not have a `focus`
		// or `blur` property).
		//
		// See: https://github.com/Microsoft/TypeScript/issues/5901#issuecomment-431649653
		if ( activeElement instanceof defaultView.HTMLElement ) {
			activeElement.focus();
		}
	}
}
