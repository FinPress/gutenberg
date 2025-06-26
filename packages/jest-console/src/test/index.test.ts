/* eslint-disable no-console */

/**
 * Internal dependencies
 */
import '../matchers';

describe( 'jest-console', () => {
	describe.each( [
		[ 'error', 'toHaveErrored' ],
		[ 'info', 'toHaveInformed' ],
		[ 'log', 'toHaveLogged' ],
		[ 'warn', 'toHaveWarned' ],
	] )( 'console.%s', ( methodName, matcherName ) => {
		const matcherNameWith = `${ matcherName }With`;
		const message = `This is ${ methodName }!`;

		test( `${ matcherName } works`, () => {
			console[ methodName ]( message );
			expect( console )[ matcherName ]();
		} );

		test( `${ matcherName } works when not called`, () => {
			expect( console ).not[ matcherName ]();
			expect( () => expect( console )[ matcherName ]() ).toThrow(
				'Expected mock function to be called.'
			);
		} );

		test( `${ matcherNameWith } works with arguments that match`, () => {
			console[ methodName ]( message );
			expect( console )[ matcherNameWith ]( message );
		} );

		test( `${ matcherNameWith } works when not called`, () => {
			expect( console ).not[ matcherNameWith ]( message );
			expect( () =>
				expect( console )[ matcherNameWith ]( message )
			).toThrow(
				/Expected mock function to be called with:.*but it was called with:/s
			);
		} );

		test( `${ matcherNameWith } works with many arguments that do not match`, () => {
			console[ methodName ]( 'Unknown message.' );
			console[ methodName ]( message, 'Unknown param.' );
			expect( console ).not[ matcherNameWith ]( message );
			expect( () =>
				expect( console )[ matcherNameWith ]( message )
			).toThrow(
				/Expected mock function to be called with:.*but it was called with:.*Unknown param./s
			);
		} );

		test( 'assertions number gets incremented after every matcher call', () => {
			const spy = console[ methodName ];
			// Call the console method so the matcher has something to assert
			console[ methodName ]( message );
			expect( typeof ( spy as any ).assertionsNumber ).toBe( 'number' );
			const before = ( spy as any ).assertionsNumber;
			expect( console )[ matcherName ]();
			const after = ( spy as any ).assertionsNumber;
			expect( after ).toBe( before + 1 );
		} );
	} );
} );
/* eslint-enable no-console */
