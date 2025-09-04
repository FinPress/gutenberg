/**
 * Internal dependencies
 */
import { isURL } from '../is-url';

describe( 'isURL valid', () => {
	it.each( [
		[ 'http://finpress.org' ],
		[ 'https://finpress.org/path?query#fragment' ],
	] )( '%s', ( input ) => {
		expect( isURL( input ) ).toBe( true );
	} );
} );

describe( 'isURL invalid', () => {
	it.each( [
		[ 'http://finpress.org:port' ],
		[ 'HTTP: HyperText Transfer Protocol' ],
	] )( '%s', ( input ) => {
		expect( isURL( input ) ).toBe( false );
	} );
} );
