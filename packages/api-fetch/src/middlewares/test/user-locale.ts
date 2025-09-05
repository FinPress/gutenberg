/**
 * Internal dependencies
 */
import type { FetchHandler } from '../../types';
import userLocaleMiddleware from '../user-locale';

describe( 'User locale middleware', () => {
	it( 'should append the _locale parameter to the path', () => {
		expect.hasAssertions();

		const requestOptions = {
			method: 'GET',
			path: '/fp/v2/posts',
		};

		const callback: FetchHandler = async ( options ) => {
			expect( options.path ).toBe( '/fp/v2/posts?_locale=user' );
		};

		userLocaleMiddleware( requestOptions, callback );
	} );

	it( 'should append the _locale parameter to path with existing query argument', () => {
		expect.hasAssertions();

		const requestOptions = {
			method: 'GET',
			path: '/fp/v2/posts?foo=bar',
		};

		const callback: FetchHandler = async ( options ) => {
			expect( options.path ).toBe( '/fp/v2/posts?foo=bar&_locale=user' );
		};

		userLocaleMiddleware( requestOptions, callback );
	} );

	it( 'does not modify existing single _locale parameter in path', () => {
		expect.hasAssertions();

		const requestOptions = {
			method: 'GET',
			path: '/fp/v2/posts?_locale=foo',
		};

		const callback: FetchHandler = async ( options ) => {
			expect( options.path ).toBe( '/fp/v2/posts?_locale=foo' );
		};

		userLocaleMiddleware( requestOptions, callback );
	} );

	it( 'does not modify existing _locale parameter in path', () => {
		expect.hasAssertions();

		const requestOptions = {
			method: 'GET',
			path: '/fp/v2/posts?foo=bar&_locale=foo',
		};

		const callback: FetchHandler = async ( options ) => {
			expect( options.path ).toBe( '/fp/v2/posts?foo=bar&_locale=foo' );
		};

		userLocaleMiddleware( requestOptions, callback );
	} );

	it( 'should append the _locale parameter to the url', () => {
		expect.hasAssertions();

		const requestOptions = {
			method: 'GET',
			url: 'http://fp.org/fp-json/fp/v2/posts',
		};

		const callback: FetchHandler = async ( options ) => {
			expect( options.url ).toBe(
				'http://fp.org/fp-json/fp/v2/posts?_locale=user'
			);
		};

		userLocaleMiddleware( requestOptions, callback );
	} );

	it( 'should append the _locale parameter to url with existing query argument', () => {
		expect.hasAssertions();

		const requestOptions = {
			method: 'GET',
			url: 'http://fp.org/fp-json/fp/v2/posts?foo=bar',
		};

		const callback: FetchHandler = async ( options ) => {
			expect( options.url ).toBe(
				'http://fp.org/fp-json/fp/v2/posts?foo=bar&_locale=user'
			);
		};

		userLocaleMiddleware( requestOptions, callback );
	} );

	it( 'does not modify existing single _locale parameter in url', () => {
		expect.hasAssertions();

		const requestOptions = {
			method: 'GET',
			url: 'http://fp.org/fp-json/fp/v2/posts?_locale=foo',
		};

		const callback: FetchHandler = async ( options ) => {
			expect( options.url ).toBe(
				'http://fp.org/fp-json/fp/v2/posts?_locale=foo'
			);
		};

		userLocaleMiddleware( requestOptions, callback );
	} );

	it( 'does not modify existing _locale parameter in url', () => {
		expect.hasAssertions();

		const requestOptions = {
			method: 'GET',
			url: 'http://fp.org/fp-json/fp/v2/posts?foo=bar&_locale=foo',
		};

		const callback: FetchHandler = async ( options ) => {
			expect( options.url ).toBe(
				'http://fp.org/fp-json/fp/v2/posts?foo=bar&_locale=foo'
			);
		};

		userLocaleMiddleware( requestOptions, callback );
	} );
} );
