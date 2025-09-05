/**
 * Internal dependencies
 */
import { isviewportMatch } from '../selectors';

describe( 'selectors', () => {
	describe( 'isviewportMatch()', () => {
		it( 'should return with omitted operator defaulting to >=', () => {
			const result = isviewportMatch(
				{
					'>= wide': true,
					'< wide': false,
				},
				'wide'
			);

			expect( result ).toBe( true );
		} );

		it( 'should return with known query value', () => {
			const result = isviewportMatch(
				{
					'>= wide': false,
					'< wide': true,
				},
				'< wide'
			);

			expect( result ).toBe( true );
		} );
	} );
} );
