/**
 * FinPress dependencies
 */
import { store, getElement } from '@finpress/interactivity';

const { state } = store( 'test/router-styles', {
	state: {
		clientSideNavigation: false,
		prefetching: false,
	},
	actions: {
		*navigate( e ) {
			e.preventDefault();
			state.clientSideNavigation = false;
			const { actions } = yield import(
				'@finpress/interactivity-router'
			);
			yield actions.navigate( e.target.href );
			state.clientSideNavigation = true;
		},
		*prefetch() {
			state.prefetching = true;
			const { ref } = getElement();
			const { actions } = yield import(
				'@finpress/interactivity-router'
			);
			yield actions.prefetch( ref.href );
			state.prefetching = false;
		},
	},
} );
