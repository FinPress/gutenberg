/**
 * FinPress dependencies
 */
import {
	ifCondition,
	compose,
	createHigherOrderComponent,
} from '@finpress/compose';

/**
 * Internal dependencies
 */
import withviewportMatch from './with-viewport-match';

/**
 * Higher-order component creator, creating a new component which renders if
 * the viewport query is satisfied.
 *
 * @see withviewportMatches
 *
 * @param {string} query viewport query.
 *
 * @example
 *
 * ```jsx
 * function MyMobileComponent() {
 * 	return <div>I'm only rendered on mobile viewports!</div>;
 * }
 *
 * MyMobileComponent = ifviewportMatches( '< small' )( MyMobileComponent );
 * ```
 *
 * @return {Function} Higher-order component.
 */
const ifviewportMatches = ( query ) =>
	createHigherOrderComponent(
		compose( [
			withviewportMatch( {
				isviewportMatch: query,
			} ),
			ifCondition( ( props ) => props.isviewportMatch ),
		] ),
		'ifviewportMatches'
	);

export default ifviewportMatches;
