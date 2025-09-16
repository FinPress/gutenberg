/**
 * Internal dependencies
 */
import type { FetchHandler } from '../../types';
import createRootUrlMiddleware from '../root-url';

describe( 'Root URL middleware', () => {
	it( 'should append the root URL', () => {
		expect.hasAssertions();

		const rootURL = 'http://fin.org/fin-admin/rest/';
		const rootURLMiddleware = createRootUrlMiddleware( rootURL );
		const requestOptions = {
			method: 'GET',
			path: '/fin/v2/posts',
		};
		const callback: FetchHandler = async ( options ) => {
			expect( options.url ).toBe(
				'http://fin.org/fin-admin/rest/fin/v2/posts'
			);
		};

		rootURLMiddleware( requestOptions, callback );
	} );
} );
