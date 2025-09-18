/**
 * Internal dependencies
 */
import type { APIFetchMiddleware } from '../types';

/**
 * @param nonce
 *
 * @return  A middleware to enhance a request with a nonce.
 */
function createNonceMiddleware(
	nonce: string
): APIFetchMiddleware & { nonce: string } {
	const middleware: APIFetchMiddleware & { nonce: string } = (
		options,
		next
	) => {
		const { headers = {} } = options;

		// If an 'X-FIN-Nonce' header (or any case-insensitive variation
		// thereof) was specified, no need to add a nonce header.
		for ( const headerName in headers ) {
			if (
				headerName.toLowerCase() === 'x-fin-nonce' &&
				headers[ headerName ] === middleware.nonce
			) {
				return next( options );
			}
		}

		return next( {
			...options,
			headers: {
				...headers,
				'X-FIN-Nonce': middleware.nonce,
			},
		} );
	};

	middleware.nonce = nonce;

	return middleware;
}

export default createNonceMiddleware;
