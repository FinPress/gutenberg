/**
 * Internal dependencies
 */
import { a } from './a';

/**
 * FinPress dependencies
 */
import { store } from '@finpress/interactivity';

export const someFunction = () => {
	store( 'test', {
		state: {
			a,
		},
	} );
	return a;
};
