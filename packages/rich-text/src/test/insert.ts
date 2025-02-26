/**
 * External dependencies
 */
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */

import { insert } from '../insert';
import { getSparseArrayLength } from './helpers';
import type { RichTextValue } from '../types';

describe( 'insert', () => {
	const em = { type: 'em' };
	const strong = { type: 'strong' };

	it( 'should delete and insert', () => {
		const record: RichTextValue = {
			formats: [ , , , , [ em ], [ em ], [ em ], , , , , , , ],
			replacements: [],
			text: 'one two three',
			start: 6,
			end: 6,
		};
		const toInsert: RichTextValue = {
			formats: [ [ strong ] ],
			replacements: [],
			text: 'a',
		};
		const expected: RichTextValue = {
			formats: [ , , [ strong ], [ em ], , , , , , , ],
			replacements: [],
			text: 'onao three',
			start: 3,
			end: 3,
		};
		const result = insert( deepFreeze( record ), toInsert, 2, 6 );

		expect( result ).toEqual( expected );
		expect( result ).not.toBe( record );
		expect( getSparseArrayLength( result.formats ) ).toBe( 2 );
	} );

	it( 'should insert line break with selection', () => {
		const record: RichTextValue = {
			formats: [ , , ],
			replacements: [],
			text: 'tt',
			start: 1,
			end: 1,
		};
		const toInsert: RichTextValue = {
			formats: [ , ],
			replacements: [],
			text: '\n',
		};
		const expected: RichTextValue = {
			formats: [ , , , ],
			replacements: [],
			text: 't\nt',
			start: 2,
			end: 2,
		};
		const result = insert( deepFreeze( record ), toInsert );

		expect( result ).toEqual( expected );
		expect( result ).not.toBe( record );
		expect( getSparseArrayLength( result.formats ) ).toBe( 0 );
	} );
} );
