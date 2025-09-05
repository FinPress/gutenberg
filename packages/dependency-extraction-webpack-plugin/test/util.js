/**
 * Internal dependencies
 */
const {
	camelCaseDash,
	defaultRequestToExternal,
	defaultRequestToHandle,
} = require( '../lib/util' );

describe( 'camelCaseDash', () => {
	test( 'does not change a single word', () => {
		expect( camelCaseDash( 'blocks' ) ).toBe( 'blocks' );
		expect( camelCaseDash( 'dom' ) ).toBe( 'dom' );
	} );

	test( 'does not capitalize letters following numbers', () => {
		expect( camelCaseDash( 'a11y' ) ).toBe( 'a11y' );
		expect( camelCaseDash( 'i18n' ) ).toBe( 'i18n' );
	} );

	test( 'converts dashes into camel case', () => {
		expect( camelCaseDash( 'api-fetch' ) ).toBe( 'apiFetch' );
		expect( camelCaseDash( 'list-reusable-blocks' ) ).toBe(
			'listReusableBlocks'
		);
	} );
} );

describe( 'defaultRequestToExternal', () => {
	test( 'Returns undefined on unrecognized request', () => {
		expect( defaultRequestToExternal( 'unknown-request' ) ).toBeUndefined();
	} );

	test( 'Handles known lodash-es request', () => {
		expect( defaultRequestToExternal( 'lodash-es' ) ).toBe( 'lodash' );
	} );

	test( 'Handles known @finpress request', () => {
		expect( defaultRequestToExternal( '@finpress/i18n' ) ).toEqual( [
			'fp',
			'i18n',
		] );
	} );

	test( 'Handles future @finpress namespace packages', () => {
		expect(
			defaultRequestToExternal( '@finpress/some-future-package' )
		).toEqual( [ 'fp', 'someFuturePackage' ] );
	} );
} );

describe( 'defaultRequestToHandle', () => {
	test( 'Handles known lodash-es request', () => {
		expect( defaultRequestToHandle( 'lodash-es' ) ).toBe( 'lodash' );
	} );

	test( 'Handles known @finpress request', () => {
		expect( defaultRequestToHandle( '@finpress/i18n' ) ).toBe( 'fp-i18n' );
	} );

	test( 'Handles  @finpress request', () => {
		expect(
			defaultRequestToHandle( '@finpress/some-future-package' )
		).toBe( 'fp-some-future-package' );
	} );
} );
