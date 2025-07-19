/**
 * Suppress specific browser warnings for unit tests
 *
 * This file mocks the @wordpress/warning module to suppress specific
 * warnings that are expected or not relevant in the test environment,
 * while allowing other warnings to pass through normally.
 */

jest.mock( '@wordpress/warning', () => {
	const mockOriginalWarning =
		jest.requireActual( '@wordpress/warning' ).default;

	return {
		__esModule: true,
		default: jest.fn( ( message ) => {
			const suppressedWarningPatterns = [
				'Block API version is less than 2.', // apiVersion warnings
			];
			if ( typeof message === 'string' ) {
				const shouldSuppress = suppressedWarningPatterns.some(
					( pattern ) => message.includes( pattern )
				);
				if ( shouldSuppress ) {
					return;
				}
			}
			if ( typeof mockOriginalWarning === 'function' ) {
				mockOriginalWarning( message );
			}
		} ),
	};
} );
