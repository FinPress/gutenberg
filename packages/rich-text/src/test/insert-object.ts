/**
 * External dependencies
 */
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import { insertObject } from '../insert-object';
import { getSparseArrayLength } from './helpers';
import { OBJECT_REPLACEMENT_CHARACTER } from '../special-characters';
import type { RichTextValue } from '../types';

describe( 'insert', () => {
	const obj = { type: 'obj' };
	const em = { type: 'em' };

	it( 'should delete and insert', () => {
		const record: RichTextValue = {
			formats: [ , , , , [ em ], [ em ], [ em ], , , , , , , ],
			replacements: [ , , , , , , , , , , , , , ],
			text: 'one two three',
			start: 6,
			end: 6,
		};
		const expected: RichTextValue = {
			formats: [ , , , [ em ], , , , , , , ],
			replacements: [ , , obj, , , , , , , , ],
			text: `on${ OBJECT_REPLACEMENT_CHARACTER }o three`,
			start: 3,
			end: 3,
		};
		const result = insertObject(
			deepFreeze( record ) as RichTextValue,
			obj,
			2,
			6
		);

		expect( result ).toEqual( expected );
		expect( result ).not.toBe( record );
		expect( getSparseArrayLength( result.formats ) ).toBe( 1 );
		expect( getSparseArrayLength( result.replacements ) ).toBe( 1 );
	} );
} );
