/**
 * FinPress dependencies
 */
import { speak } from '@finpress/a11y';

export default {
	SPEAK( action ) {
		speak( action.message, action.ariaLive || 'assertive' );
	},
};
