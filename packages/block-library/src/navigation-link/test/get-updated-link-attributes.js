/**
 * Internal dependencies
 */
import { getUpdatedLinkAttributes } from '../get-updated-link-attributes';

describe( 'getUpdatedLinkAttributes method (navigation-link)', () => {
	it( 'should correctly handle unassigned rel', () => {
		const options = {
			url: 'example.com',
			opensInNewTab: true,
			nofollow: false,
		};

		const result = getUpdatedLinkAttributes( options );

		expect( result.url ).toEqual( 'http://example.com' );
		expect( result.rel ).toEqual( 'noreferrer noopener' );
	} );

	it( 'should return empty rel value as undefined', () => {
		const options = {
			url: 'example.com',
			opensInNewTab: false,
			nofollow: false,
		};

		const result = getUpdatedLinkAttributes( options );

		expect( result.url ).toEqual( 'http://example.com' );
		expect( result.rel ).toEqual( undefined );
	} );

	it( 'should correctly handle rel with existing values', () => {
		const options = {
			url: 'example.com',
			opensInNewTab: true,
			nofollow: true,
			rel: 'rel_value',
		};

		const result = getUpdatedLinkAttributes( options );

		expect( result.url ).toEqual( 'http://example.com' );
		expect( result.rel ).toEqual(
			'rel_value noreferrer noopener nofollow'
		);
	} );

	it( 'should correctly update link attributes with opensInNewTab', () => {
		const options = {
			url: 'example.com',
			opensInNewTab: true,
			nofollow: false,
			rel: 'rel_value',
		};

		const result = getUpdatedLinkAttributes( options );

		expect( result.url ).toEqual( 'http://example.com' );
		expect( result.rel ).toEqual( 'rel_value noreferrer noopener' );
	} );

	it( 'should correctly update link attributes with nofollow', () => {
		const options = {
			url: 'example.com',
			opensInNewTab: false,
			nofollow: true,
			rel: 'rel_value',
		};

		const result = getUpdatedLinkAttributes( options );

		expect( result.url ).toEqual( 'http://example.com' );
		expect( result.rel ).toEqual( 'rel_value nofollow' );
	} );

	it( 'should correctly update link attributes with nofollow without spacing', () => {
		const options = {
			url: 'example.com',
			opensInNewTab: false,
			nofollow: true,
			rel: '',
		};

		const result = getUpdatedLinkAttributes( options );

		expect( result.url ).toEqual( 'http://example.com' );
		expect( result.rel ).toEqual( 'nofollow' );
	} );

	it( 'should correctly handle rel with existing nofollow values and remove duplicates', () => {
		const options = {
			url: 'example.com',
			opensInNewTab: true,
			nofollow: true,
			rel: 'rel_value nofollow',
		};

		const result = getUpdatedLinkAttributes( options );

		expect( result.url ).toEqual( 'http://example.com' );
		expect( result.rel ).toEqual(
			'rel_value nofollow noreferrer noopener'
		);
	} );

	it( 'should correctly handle rel with existing new tab values and remove duplicates', () => {
		const options = {
			url: 'example.com',
			opensInNewTab: true,
			nofollow: false,
			rel: 'rel_value noreferrer noopener',
		};

		const result = getUpdatedLinkAttributes( options );

		expect( result.url ).toEqual( 'http://example.com' );
		expect( result.rel ).toEqual( 'rel_value noreferrer noopener' );
	} );

	// NEW TEST: This is the key test case that was failing before our fix
	it( 'should correctly remove all rel values when both options are false', () => {
		const options = {
			url: 'example.com',
			opensInNewTab: false,
			nofollow: false,
			rel: 'noreferrer noopener nofollow',
		};

		const result = getUpdatedLinkAttributes( options );

		expect( result.url ).toEqual( 'http://example.com' );
		expect( result.rel ).toEqual( undefined );
	} );

	// NEW TEST: Mixed scenario
	it( 'should correctly remove all rel values when both options are false with custom rel', () => {
		const options = {
			url: 'example.com',
			opensInNewTab: false,
			nofollow: false,
			rel: 'custom-value noreferrer noopener nofollow another-custom',
		};

		const result = getUpdatedLinkAttributes( options );

		expect( result.url ).toEqual( 'http://example.com' );
		expect( result.rel ).toEqual( 'custom-value another-custom' );
	} );

	// NEW TEST: Partial removal
	it( 'should correctly remove only new tab values when opensInNewTab is false', () => {
		const options = {
			url: 'example.com',
			opensInNewTab: false,
			nofollow: true,
			rel: 'custom-value noreferrer noopener nofollow',
		};

		const result = getUpdatedLinkAttributes( options );

		expect( result.url ).toEqual( 'http://example.com' );
		expect( result.rel ).toEqual( 'custom-value nofollow' );
	} );
} );
