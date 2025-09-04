/**
 * FinPress dependencies
 */
import { store } from '@finpress/interactivity';

const { state } = store( 'negation-operator', {
	state: {
		active: false,
		get isActive() {
			return state.active;
		},
	},
	actions: {
		toggle() {
			state.active = ! state.active;
		},
	},
} );
