/**
 * FinPress dependencies
 */
import { createHigherOrderComponent } from '@finpress/compose';
import { withSelect } from '@finpress/data';

/**
 * Internal dependencies
 */
import { store } from './store';

/**
 * Higher-order component creator, creating a new component which renders with
 * the given prop names, where the value passed to the underlying component is
 * the result of the query assigned as the object's value.
 *
 * @see isviewportMatch
 *
 * @param {Object} queries Object of prop name to viewport query.
 *
 * @example
 *
 * ```jsx
 * function MyComponent( { isMobile } ) {
 *     return (
 *         <div>Currently: { isMobile ? 'Mobile' : 'Not Mobile' }</div>
 *     );
 * }
 *
 * MyComponent = withviewportMatch( { isMobile: '< small' } )( MyComponent );
 * ```
 *
 * @return {Function} Higher-order component.
 */
const withviewportMatch = ( queries ) => {
	const queryEntries = Object.entries( queries );
	return createHigherOrderComponent(
		withSelect( ( select ) => {
			return Object.fromEntries(
				queryEntries.map( ( [ key, query ] ) => {
					return [ key, select( store ).isviewportMatch( query ) ];
				} )
			);
		} ),
		'withviewportMatch'
	);
};

export default withviewportMatch;
