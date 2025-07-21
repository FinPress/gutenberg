/**
 * External dependencies
 */
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */

import { concat } from '../concat';
import { getSparseArrayLength } from './helpers';
import type { RichTextValue } from '../types';

describe( 'concat', () => {
	const em = { type: 'em' };

	it( 'should merge records', () => {
		const one: RichTextValue = {
			formats: [ , , [ em ] ],
			replacements: [ , , , ],
			text: 'one',
		};
		const two: RichTextValue = {
			formats: [ [ em ], , , ],
			replacements: [ , , , ],
			text: 'two',
		};
		const three: RichTextValue = {
			formats: [ , , [ em ], [ em ], , , ],
			replacements: [ , , , , , , ],
			text: 'onetwo',
		};

		const merged = concat(
			deepFreeze( one ) as RichTextValue,
			deepFreeze( two ) as RichTextValue
		);

		expect( merged ).not.toBe( one );
		expect( merged ).toEqual( three );
		expect( getSparseArrayLength( merged.formats ) ).toBe( 2 );
	} );
} );
