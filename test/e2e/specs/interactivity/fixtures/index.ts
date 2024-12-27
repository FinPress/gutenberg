/**
 * WordPress dependencies
 */
import { test as base } from '@wordpress/e2e-test-utils-playwright';
export { expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies
 */
import InteractivityUtils from './interactivity-utils';

type Fixtures = {
	interactivityUtils: InteractivityUtils;
};

export const test = base.extend< Fixtures >( {
	// @ts-expect-error: The required type is 'test', but can be 'worker' too. See
	// https://playwright.dev/docs/test-fixtures#worker-scoped-fixtures
	interactivityUtils: [
		async ( { requestUtils }, use ) => {
			await use( new InteractivityUtils( { requestUtils } ) );
		},
		{ scope: 'worker' },
	],
} );
