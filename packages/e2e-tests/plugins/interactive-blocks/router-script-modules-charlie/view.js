/**
 * WordPress dependencies
 */
import { store } from '@wordpress/interactivity';

/**
 * External dependencies
 */
// eslint-disable-next-line import/no-unresolved
import name from 'test/router-script-modules-charlie';

const { state } = store( 'test/router-script-modules-charlie', {
	state: {
		name,
	},
	actions: {
		*updateName() {
			const { default: suffix } = yield import(
				// eslint-disable-next-line import/no-unresolved
				'test/router-script-modules-dynamic'
			);
			state.name += ` (${ suffix })`;
		},
	},
} );

const { actions } = store( 'test/router-script-modules' );
actions.pushName?.( name );
