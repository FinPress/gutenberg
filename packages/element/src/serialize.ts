/**
 * Parts of this source were derived and modified from fast-react-render,
 * released under the MIT license.
 *
 * https://github.com/alt-j/fast-react-render
 *
 * Copyright (c) 2016 Andrey Morozov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * External dependencies
 */
import { isPlainObject } from 'is-plain-object';
import { paramCase as kebabCase } from 'change-case';

/**
 * WordPress dependencies
 */
import {
	escapeHTML,
	escapeAttribute,
	isValidAttributeName,
} from '@wordpress/escape-html';

/**
 * Internal dependencies
 */
import { createContext, Fragment, StrictMode, forwardRef } from './react';
import RawHTMLDefault from './raw-html';

import type {
	ReactNode,
	ReactElement,
	ComponentType,
	ComponentClass,
} from 'react';

type ReactComponentWithTypeof = {
	$$typeof: symbol;
	( props: any ): ReactElement | null;
};

const { Provider, Consumer } = createContext( undefined );
const ForwardRef = forwardRef( () => null );

const RawHTML = RawHTMLDefault as ReactComponentWithTypeof;

const SELF_CLOSING_TAGS = new Set( [
	'area',
	'base',
	'br',
	'col',
	'command',
	'embed',
	'hr',
	'img',
	'input',
	'keygen',
	'link',
	'meta',
	'param',
	'source',
	'track',
	'wbr',
] );

const BOOLEAN_ATTRIBUTES = new Set( [
	'allowfullscreen',
	'allowpaymentrequest',
	'allowusermedia',
	'async',
	'autofocus',
	'autoplay',
	'checked',
	'controls',
	'default',
	'defer',
	'disabled',
	'download',
	'formnovalidate',
	'hidden',
	'ismap',
	'itemscope',
	'loop',
	'multiple',
	'muted',
	'nomodule',
	'novalidate',
	'open',
	'playsinline',
	'readonly',
	'required',
	'reversed',
	'selected',
	'typemustmatch',
] );

const SVG_ATTRIBUTE_WITH_DASHES_LIST = [
	'accent-height',
	'alignment-baseline',
	'arabic-form',
	'baseline-shift',
	'cap-height',
	'clip-path',
	'clip-rule',
	'color-interpolation',
	'color-interpolation-filters',
	'color-profile',
	'color-rendering',
	'dominant-baseline',
	'enable-background',
	'fill-opacity',
	'fill-rule',
	'flood-color',
	'flood-opacity',
	'font-family',
	'font-size',
	'font-size-adjust',
	'font-stretch',
	'font-style',
	'font-variant',
	'font-weight',
	'glyph-name',
	'glyph-orientation-horizontal',
	'glyph-orientation-vertical',
	'horiz-adv-x',
	'horiz-origin-x',
	'image-rendering',
	'letter-spacing',
	'lighting-color',
	'marker-end',
	'marker-mid',
	'marker-start',
	'overline-position',
	'overline-thickness',
	'panose-1',
	'paint-order',
	'pointer-events',
	'rendering-intent',
	'shape-rendering',
	'stop-color',
	'stop-opacity',
	'strikethrough-position',
	'strikethrough-thickness',
	'stroke-dasharray',
	'stroke-dashoffset',
	'stroke-linecap',
	'stroke-linejoin',
	'stroke-miterlimit',
	'stroke-opacity',
	'stroke-width',
	'text-anchor',
	'text-decoration',
	'text-rendering',
	'unicode-bidi',
	'underline-position',
	'underline-thickness',
	'unicode-range',
	'units-per-em',
	'v-alphabetic',
	'v-hanging',
	'v-ideographic',
	'v-mathematical',
	'vector-effect',
	'vert-adv-y',
	'vert-origin-x',
	'vert-origin-y',
	'word-spacing',
	'writing-mode',
	'x-height',
];

const CASE_SENSITIVE_SVG_ATTRIBUTES = new Set( SVG_ATTRIBUTE_WITH_DASHES_LIST );
const SVG_ATTRIBUTES_WITH_COLONS = new Set( [ 'xlink:href', 'xml:space' ] );

const CSS_PROPERTIES_SUPPORTS_UNITLESS = new Set( [
	'animation',
	'animationIterationCount',
	'baselineShift',
	'borderImageOutset',
	'borderImageSlice',
	'borderImageWidth',
	'columnCount',
	'cx',
	'cy',
	'fillOpacity',
	'flexGrow',
	'flexShrink',
	'floodOpacity',
	'fontWeight',
	'gridColumnEnd',
	'gridColumnStart',
	'gridRowEnd',
	'gridRowStart',
	'lineHeight',
	'opacity',
	'order',
	'orphans',
	'r',
	'rx',
	'ry',
	'shapeImageThreshold',
	'stopOpacity',
	'strokeDasharray',
	'strokeDashoffset',
	'strokeMiterlimit',
	'strokeOpacity',
	'strokeWidth',
	'tabSize',
	'widows',
	'x',
	'y',
	'zIndex',
	'zoom',
] );

/**
 * Checks whether an attribute is internal to React.
 * @param attr
 */
function isInternalAttribute( attr: string ): boolean {
	return attr === 'key' || attr === 'children';
}

/**
 * Normalizes a style property name (camelCase → kebab-case).
 * @param property
 */
function getNormalStylePropertyName( property: string ): string {
	return kebabCase( property );
}

/**
 * Converts a camelCase attribute to kebab-case for serialization.
 * @param attr
 */
function getNormalAttributeName( attr: string ): string {
	if ( CASE_SENSITIVE_SVG_ATTRIBUTES.has( attr ) ) {
		return attr;
	}

	if ( SVG_ATTRIBUTES_WITH_COLONS.has( attr ) ) {
		return attr;
	}

	return kebabCase( attr );
}

/**
 * Renders a style object to a valid inline style string.
 * @param value
 */
function renderStyle( value: unknown ): string {
	if ( ! isPlainObject( value ) ) {
		return '';
	}

	return Object.entries( value )
		.map( ( [ key, val ] ) => {
			if ( val === null ) {
				return '';
			}

			const name = getNormalStylePropertyName( key );
			const unit =
				typeof val === 'number' &&
				! CSS_PROPERTIES_SUPPORTS_UNITLESS.has( key )
					? `${ val }px`
					: val;

			return `${ name }:${ unit };`;
		} )
		.filter( Boolean )
		.join( '' );
}

/**
 * Normalizes an attribute's value.
 * @param attr
 * @param value
 */
function getNormalAttributeValue( attr: string, value: unknown ): unknown {
	if ( attr === 'style' ) {
		return renderStyle( value );
	}
	return value;
}

/**
 * Renders a single HTML attribute to string.
 * @param name
 * @param value
 */
function renderAttribute( name: string, value: unknown ): string {
	const normalName = getNormalAttributeName( name );

	if ( BOOLEAN_ATTRIBUTES.has( normalName ) ) {
		if ( ! value ) {
			return '';
		}
		return ` ${ normalName }`;
	}

	if ( value === null ) {
		return '';
	}
	return ` ${ normalName }="${ escapeAttribute( String( value ) ) }"`;
}

/**
 * Renders HTML attributes from props.
 * @param props
 */
function renderAttributes( props: Record< string, unknown > ): string {
	return Object.entries( props )
		.filter(
			( [ name ] ) =>
				! isInternalAttribute( name ) && isValidAttributeName( name )
		)
		.map( ( [ name, value ] ) =>
			renderAttribute( name, getNormalAttributeValue( name, value ) )
		)
		.join( '' );
}

/**
 * Recursively renders a ReactNode to HTML.
 * @param element
 */
const renderToString = ( element: ReactNode ): string => {
	if ( typeof element === 'string' || typeof element === 'number' ) {
		return escapeHTML( String( element ) );
	}

	if (
		element === null ||
		element === undefined ||
		typeof element === 'boolean'
	) {
		return '';
	}

	if ( Array.isArray( element ) ) {
		return element.map( renderToString ).join( '' );
	}

	if ( ( element as any ).$$typeof === RawHTML.$$typeof ) {
		return String( ( element as any ).props.children || '' );
	}

	if (
		( element as any ).$$typeof === Fragment ||
		( element as any ).$$typeof === StrictMode
	) {
		return renderToString( ( element as any ).props.children );
	}

	if (
		( element as any ).type === Consumer ||
		( element as any ).type === Provider ||
		( element as any ).type === ForwardRef
	) {
		return '';
	}

	if ( typeof ( element as ReactElement ).type === 'function' ) {
		const Component = ( element as ReactElement ).type as ComponentType;
		const props = { ...( element as ReactElement ).props };
		const rendered = ( Component as ComponentClass ).prototype?.render
			? new ( Component as ComponentClass )( props ).render()
			: ( Component as Function )( props );

		return renderToString( rendered );
	}

	const { type, props } = element as ReactElement;

	const tag = typeof type === 'string' ? type : 'div';
	const attrs = renderAttributes( props || {} );
	const children = renderToString( props?.children );

	if ( SELF_CLOSING_TAGS.has( tag ) && ! children ) {
		return `<${ tag }${ attrs } />`;
	}

	return `<${ tag }${ attrs }>${ children }</${ tag }>`;
};

export default renderToString;
