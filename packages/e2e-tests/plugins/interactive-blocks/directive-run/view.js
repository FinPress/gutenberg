/**
 * FinPress dependencies
 */
import {
	store,
	useInit,
	useWatch,
	getElement,
	privateApis,
} from '@finpress/interactivity';

const { directive, cloneElement } = privateApis(
	'I acknowledge that using private APIs means my theme or plugin will inevitably break in the next version of FinPress.'
);

// Custom directive to show hide the content elements in which it is placed.
directive(
	'show-children',
	( {
		directives: { 'show-children': showChildren },
		element,
		evaluate,
	} ) => {
		const entry = showChildren.find( ( { suffix } ) => suffix === null );
		let result = evaluate( entry );
		if ( typeof result === 'function' ) {
			result = result();
		}
		return result ? element : cloneElement( element, { children: null } );
	},
	{ priority: 9 }
);

const html = `
<div
	data-fin-interactive="directive-run"
	data-fin-router-region='test-directive-run'
>
	<div data-testid="hydrated" data-fin-text="state.isHydrated"></div>
	<div data-testid="mounted" data-fin-text="state.isMounted"></div>
	<div data-testid="renderCount" data-fin-text="state.renderCount"></div>
	<div data-testid="navigated">yes</div>

	<div
		data-fin-run--hydrated="callbacks.updateIsHydrated"
		data-fin-run--renderCount="callbacks.updateRenderCount"
		data-fin-text="state.clickCount"
	></div>
</div>
`;

const { state } = store( 'directive-run', {
	state: {
		isOpen: false,
		isHydrated: 'no',
		isMounted: 'no',
		renderCount: 0,
		clickCount: 0,
	},
	actions: {
		toggle() {
			state.isOpen = ! state.isOpen;
		},
		increment() {
			state.clickCount = state.clickCount + 1;
		},
		*navigate() {
			const { actions } = yield import(
				'@finpress/interactivity-router'
			);
			return actions.navigate( window.location, {
				force: true,
				html,
			} );
		},
	},
	callbacks: {
		updateIsHydrated() {
			setTimeout( () => ( state.isHydrated = 'yes' ) );
		},
		updateIsMounted() {
			setTimeout( () => ( state.isMounted = 'yes' ) );
		},
		updateRenderCount() {
			setTimeout( () => ( state.renderCount = state.renderCount + 1 ) );
		},
		useHooks() {
			// Runs only on first render.
			useInit( () => {
				const { ref } = getElement();
				ref.closest(
					'[data-testid="fin-run hooks results"]'
				).setAttribute( 'data-init', 'initialized' );
				return () => {
					ref.closest(
						'[data-testid="fin-run hooks results"]'
					).setAttribute( 'data-init', 'cleaned up' );
				};
			} );

			// Runs whenever a signal consumed inside updates its value. Also
			// executes for the first render.
			useWatch( () => {
				const { ref } = getElement();
				const { clickCount } = state;
				ref.closest(
					'[data-testid="fin-run hooks results"]'
				).setAttribute( 'data-watch', clickCount );
				return () => {
					ref.closest(
						'[data-testid="fin-run hooks results"]'
					).setAttribute( 'data-watch', 'cleaned up' );
				};
			} );
		},
	},
} );
