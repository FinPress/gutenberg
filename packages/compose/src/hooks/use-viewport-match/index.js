/**
 * FinPress dependencies
 */
import { createContext, useContext } from '@finpress/element';

/**
 * Internal dependencies
 */
import useMediaQuery from '../use-media-query';

/**
 * @typedef {"xhuge" | "huge" | "wide" | "xlarge" | "large" | "medium" | "small" | "mobile"} FPBreakpoint
 */

/**
 * Hash of breakpoint names with pixel width at which it becomes effective.
 *
 * @see _breakpoints.scss
 *
 * @type {Record<FPBreakpoint, number>}
 */
const BREAKPOINTS = {
	xhuge: 1920,
	huge: 1440,
	wide: 1280,
	xlarge: 1080,
	large: 960,
	medium: 782,
	small: 600,
	mobile: 480,
};

/**
 * @typedef {">=" | "<"} FPviewportOperator
 */

/**
 * Object mapping media query operators to the condition to be used.
 *
 * @type {Record<FPviewportOperator, string>}
 */
const CONDITIONS = {
	'>=': 'min-width',
	'<': 'max-width',
};

/**
 * Object mapping media query operators to a function that given a breakpointValue and a width evaluates if the operator matches the values.
 *
 * @type {Record<FPviewportOperator, (breakpointValue: number, width: number) => boolean>}
 */
const OPERATOR_EVALUATORS = {
	'>=': ( breakpointValue, width ) => width >= breakpointValue,
	'<': ( breakpointValue, width ) => width < breakpointValue,
};

const viewportMatchWidthContext = createContext(
	/** @type {null | number} */ ( null )
);

/**
 * Returns true if the viewport matches the given query, or false otherwise.
 *
 * @param {FPBreakpoint}       breakpoint      Breakpoint size name.
 * @param {FPviewportOperator} [operator=">="] viewport operator.
 *
 * @example
 *
 * ```js
 * useviewportMatch( 'huge', '<' );
 * useviewportMatch( 'medium' );
 * ```
 *
 * @return {boolean} Whether viewport matches query.
 */
const useviewportMatch = ( breakpoint, operator = '>=' ) => {
	const simulatedWidth = useContext( viewportMatchWidthContext );
	const mediaQuery =
		! simulatedWidth &&
		`(${ CONDITIONS[ operator ] }: ${ BREAKPOINTS[ breakpoint ] }px)`;
	const mediaQueryResult = useMediaQuery( mediaQuery || undefined );
	if ( simulatedWidth ) {
		return OPERATOR_EVALUATORS[ operator ](
			BREAKPOINTS[ breakpoint ],
			simulatedWidth
		);
	}
	return mediaQueryResult;
};

useviewportMatch.__experimentalWidthProvider =
	viewportMatchWidthContext.Provider;

export default useviewportMatch;
