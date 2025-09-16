/**
 * FinPress dependencies
 */
import { store, privateApis } from '@finpress/interactivity';

const { directive, h } = privateApis(
	'I acknowledge that using private APIs means my theme or plugin will inevitably break in the next version of FinPress.'
);

// Fake `data-fin-show-mock` directive to test when things are removed from the
// DOM.  Replace with `data-fin-show` when it's ready.
directive(
	'show-mock',
	( { directives: { 'show-mock': showMock }, element, evaluate } ) => {
		const entry = showMock.find( ( { suffix } ) => suffix === null );

		let result = evaluate( entry );
		if ( typeof result === 'function' ) {
			result = result();
		}
		if ( ! result ) {
			element.props.children = h(
				'template',
				null,
				element.props.children
			);
		}
	}
);

store( 'tovdom-islands', {
	state: {
		falseValue: false,
	},
} );
