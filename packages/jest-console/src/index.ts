/**
 * Internal dependencies
 */
import './matchers';
import supportedMatchers from './supported-matchers';

/**
 * Sets spy on the console object's method to make it possible to fail test when method called without assertion.
 *
 * @param args
 */
const setConsoleMethodSpy = ( args: [ string, string ] ) => {
	const [ methodName, matcherName ] = args;
	const spy = jest
		.spyOn( console, methodName as 'error' | 'info' | 'log' | 'warn' )
		.mockName( `console.${ methodName }` );

	function resetSpy() {
		spy.mockReset();
		( spy as any ).assertionsNumber = 0;
	}

	function assertExpectedCalls() {
		if (
			( spy as any ).assertionsNumber === 0 &&
			spy.mock.calls.length > 0
		) {
			expect( console ).not[ matcherName ]();
		}
	}

	beforeAll( resetSpy );

	beforeEach( () => {
		assertExpectedCalls();
		resetSpy();
	} );

	afterEach( assertExpectedCalls );
};

Object.entries( supportedMatchers ).forEach( setConsoleMethodSpy );
