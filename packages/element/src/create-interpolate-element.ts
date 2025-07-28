/**
 * Internal dependencies
 */
import { createElement, cloneElement, Fragment, isValidElement } from './react';
/**
 * External dependencies
 */
import type { ReactElement } from 'react';

/**
 * The stack frame tracking parse progress.
 *
 * @typedef Frame
 *
 * @property {ReactElement}              element            A parent element which may still have
 *                                                          nested children not yet parsed.
 * @property {number}                    tokenStart         Offset at which parent element first appears.
 * @property {number}                    tokenLength        Length of string marking start of parent element.
 * @property {number}                    [prevOffset]       Running offset at which parsing should continue.
 * @property {number}                    [leadingTextStart] Offset at which last closing element finished,
 *                                                          used for finding text between elements.
 * @property {(ReactElement | string)[]} children           Children of this element.
 */
interface Frame {
	element: ReactElement;
	tokenStart: number;
	tokenLength: number;
	prevOffset?: number;
	leadingTextStart?: number | null;
	children: Array< ReactElement | string >;
}

// Global parse state
let indoc: string;
let offset: number;
let output: Array< ReactElement | string >;
let stack: Frame[];

/**
 * Matches tags in the localized string.
 */
const tokenizer = /<(\/)?(\w+)\s*(\/)?>/g;

type TokenMatch =
	| [ 'no-more-tokens' ]
	| [ 'self-closed', string, number, number ]
	| [ 'closer', string, number, number ]
	| [ 'opener', string, number, number ];

/**
 * Tracks recursive-descent parse state.
 *
 * @private
 *
 * @param  element          A parent element which may still have nested children.
 * @param  tokenStart       Offset at which parent element first appears.
 * @param  tokenLength      Length of string marking start of parent element.
 * @param  prevOffset       Running offset for nested children.
 * @param  leadingTextStart Offset at which last closing element finished.
 *
 * @return {Frame} The stack frame tracking parse progress.
 */
function createFrame(
	element: ReactElement,
	tokenStart: number,
	tokenLength: number,
	prevOffset?: number,
	leadingTextStart?: number | null
): Frame {
	return {
		element,
		tokenStart,
		tokenLength,
		prevOffset,
		leadingTextStart,
		children: [],
	};
}

/**
 * This function creates an interpolated element from a passed-in string with
 * specific tags matching how the string should be converted to an element via
 * the conversion map.
 *
 * @example
 * ```ts
 * const result = createInterpolateElement(
 *   'This is a <strong>bold</strong> word.',
 *   { strong: <strong /> }
 * );
 * ```
 *
 * @param  interpolatedString The string to be parsed.
 * @param  conversionMap      A map where tag names map to React elements.
 * @throws {TypeError}       If conversionMap is not valid.
 *
 * @return A React element.
 */
const createInterpolateElement = (
	interpolatedString: string,
	conversionMap: Record< string, ReactElement >
): ReactElement => {
	indoc = interpolatedString;
	offset = 0;
	output = [];
	stack = [];
	tokenizer.lastIndex = 0;

	if ( ! isValidConversionMap( conversionMap ) ) {
		throw new TypeError(
			'The conversionMap provided is not valid. It must be an object with values that are React Elements'
		);
	}

	while ( proceed( conversionMap ) ) {
		// parsing happens in `proceed`
	}

	return createElement( Fragment, null, ...output );
};

/**
 * Validate conversion map.
 *
 * A map is considered valid if it's an object and every value in the object
 * is a valid React Element.
 *
 * @private
 *
 * @param conversionMap The map being validated.
 *
 * @return True if valid.
 */
function isValidConversionMap(
	conversionMap: unknown
): conversionMap is Record< string, ReactElement > {
	if ( typeof conversionMap !== 'object' || conversionMap === null ) {
		return false;
	}
	const values = Object.values( conversionMap );
	return values.length > 0 && values.every( ( el ) => isValidElement( el ) );
}

/**
 * This is the iterator over the matches in the string.
 *
 * @private
 *
 * @param conversionMap The conversion map for the string.
 *
 * @return True to continue iterating, false if finished.
 */
function proceed( conversionMap: Record< string, ReactElement > ): boolean {
	const next = nextToken();
	const [ tokenType, name, startOffset, tokenLength ] = next;
	const stackDepth = stack.length;
	const leadingTextStart =
		startOffset !== undefined && startOffset > offset ? offset : null;

	if ( tokenType !== 'no-more-tokens' && name && ! conversionMap[ name ] ) {
		addText();
		return false;
	}

	switch ( tokenType ) {
		case 'no-more-tokens':
			if ( stackDepth !== 0 ) {
				const { leadingTextStart: stackLeadingText, tokenStart } =
					stack.pop()!;
				if (
					stackLeadingText !== null &&
					stackLeadingText !== undefined
				) {
					output.push(
						indoc.substring( stackLeadingText, tokenStart )
					);
				}
			}
			addText();
			return false;

		case 'self-closed':
			if ( stackDepth === 0 ) {
				if ( leadingTextStart !== null ) {
					output.push(
						indoc.substring(
							leadingTextStart,
							startOffset! - leadingTextStart
						)
					);
				}
				output.push( conversionMap[ name! ] );
				offset = startOffset! + tokenLength!;
				return true;
			}
			addChild(
				createFrame(
					conversionMap[ name! ],
					startOffset!,
					tokenLength!
				)
			);
			offset = startOffset! + tokenLength!;
			return true;

		case 'opener':
			stack.push(
				createFrame(
					conversionMap[ name! ],
					startOffset!,
					tokenLength!,
					startOffset! + tokenLength!,
					leadingTextStart
				)
			);
			offset = startOffset! + tokenLength!;
			return true;

		case 'closer': {
			if ( stackDepth === 1 ) {
				closeOuterElement( startOffset! );
				offset = startOffset! + tokenLength!;
				return true;
			}
			const stackTop = stack.pop()!;
			const text = indoc.substring(
				stackTop.prevOffset!,
				startOffset! - stackTop.prevOffset!
			);
			stackTop.children.push( text );
			stackTop.prevOffset = startOffset! + tokenLength!;
			const frame = createFrame(
				stackTop.element,
				stackTop.tokenStart,
				stackTop.tokenLength,
				startOffset! + tokenLength!
			);
			frame.children = stackTop.children;
			addChild( frame );
			offset = startOffset! + tokenLength!;
			return true;
		}

		default:
			addText();
			return false;
	}
}

/**
 * Grabs the next token match in the string and returns its details.
 *
 * @private
 *
 * @return An array containing token type and metadata.
 */
function nextToken(): TokenMatch {
	const matches = tokenizer.exec( indoc );
	if ( matches === null ) {
		return [ 'no-more-tokens' ];
	}
	const startedAt = matches.index;
	const [ match, isClosing, name, isSelfClosed ] = matches;
	const length = match.length;

	if ( isSelfClosed ) {
		return [ 'self-closed', name, startedAt, length ];
	}
	if ( isClosing ) {
		return [ 'closer', name, startedAt, length ];
	}
	return [ 'opener', name, startedAt, length ];
}

/**
 * Pushes text extracted from the string into the output array.
 *
 * @private
 */
function addText(): void {
	const length = indoc.length - offset;
	if ( length === 0 ) {
		return;
	}
	output.push( indoc.substring( offset, offset + length ) );
}

/**
 * Pushes a child element into the active parent in the stack.
 *
 * @private
 *
 * @param frame The child frame to attach.
 */
function addChild( frame: Frame ): void {
	const { element, tokenStart, tokenLength, prevOffset, children } = frame;
	const parent = stack[ stack.length - 1 ];
	const text = indoc.substring(
		parent.prevOffset!,
		tokenStart - parent.prevOffset!
	);

	if ( text ) {
		parent.children.push( text );
	}
	parent.children.push( cloneElement( element, null, ...children ) );
	parent.prevOffset = prevOffset ?? tokenStart + tokenLength;
}

/**
 * Called when closing an outermost element. Finalizes the element and appends to output.
 *
 * @private
 *
 * @param endOffset The location of the closing tag in the string.
 */
function closeOuterElement( endOffset: number ): void {
	const { element, leadingTextStart, prevOffset, tokenStart, children } =
		stack.pop()!;

	const text = endOffset
		? indoc.substring( prevOffset!, endOffset - prevOffset! )
		: indoc.substring( prevOffset! );

	if ( text ) {
		children.push( text );
	}

	if ( leadingTextStart !== null && leadingTextStart !== undefined ) {
		output.push(
			indoc.substring( leadingTextStart, tokenStart - leadingTextStart )
		);
	}

	output.push( cloneElement( element, null, ...children ) );
}

export default createInterpolateElement;
