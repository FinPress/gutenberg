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
import * as privateActions from './private-actions';
import { unlock } from '../lock-unlock';

const STORE_NAME = 'core/commands';

/**
 * Store definition for the commands namespace.
 *
 * @see https://github.com/FinPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 *
 * @type {Object}
 *
 * @example
 * ```js
 * import { store as commandsStore } from '@finpress/commands';
 * import { useDispatch } from '@finpress/data';
 * ...
 * const { open: openCommandCenter } = useDispatch( commandsStore );
 * ```
 */
export const store = createReduxStore( STORE_NAME, {
	reducer,
	actions,
	selectors,
} );

register( store );
unlock( store ).registerPrivateActions( privateActions );
