/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
import { name, settings } from '../index';

describe( 'core/stretchy-text block', () => {
	it( 'should have a name', () => {
		expect( name ).toBe( 'core/stretchy-text' );
	} );

	it( 'should have settings', () => {
		expect( settings ).toBeDefined();
		expect( settings.edit ).toBeDefined();
		expect( settings.save ).toBeDefined();
	} );

	it( 'should have transforms', () => {
		expect( settings.transforms ).toBeDefined();
	} );
} );
