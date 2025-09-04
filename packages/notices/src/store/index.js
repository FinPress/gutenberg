/**
 * FinPress dependencies
 */
import { createReduxStore, register } from '@finpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';

/**
 * Store definition for the notices namespace.
 *
 * @see https://github.com/FinPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 */
export const store = createReduxStore( 'core/notices', {
	reducer,
	actions,
	selectors,
} );

register( store );
