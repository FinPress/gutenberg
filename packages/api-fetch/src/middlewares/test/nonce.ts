/**
 * Internal dependencies
 */
import type { FetchHandler } from '../../types';
import createNonceMiddleware from '../nonce';

describe( 'Nonce middleware', () => {
	it( 'should add a nonce header to the request', () => {
		expect.hasAssertions();

		const nonce = 'nonce';
		const nonceMiddleware = createNonceMiddleware( nonce );
		const requestOptions = {
			method: 'GET',
			path: '/fin/v2/posts',
		};
		const callback: FetchHandler = async ( options ) => {
			expect( options.headers![ 'X-FP-Nonce' ] ).toBe( nonce );
		};

		nonceMiddleware( requestOptions, callback );
	} );

	it( 'should update the nonce in requests with outdated nonces', () => {
		expect.hasAssertions();

		const nonce = 'new nonce';
		const nonceMiddleware = createNonceMiddleware( nonce );
		const requestOptions = {
			method: 'GET',
			path: '/fin/v2/posts',
			headers: { 'X-FP-Nonce': 'existing nonce' },
		};

		const callback: FetchHandler = async ( options ) => {
			expect( options.headers![ 'X-FP-Nonce' ] ).toBe( 'new nonce' );
		};

		nonceMiddleware( requestOptions, callback );
	} );
} );
