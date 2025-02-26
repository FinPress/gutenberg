/**
 * Internal dependencies
 */

import { isEmpty } from '../is-empty';
import type { RichTextValue } from '../types';

describe( 'isEmpty', () => {
	it( 'should return true', () => {
		const one: RichTextValue = {
			formats: [],
			text: '',
			replacements: [],
		};

		expect( isEmpty( one ) ).toBe( true );
	} );

	it( 'should return false', () => {
		const one: RichTextValue = {
			formats: [],
			text: 'test',
			replacements: [],
		};

		expect( isEmpty( one ) ).toBe( false );
	} );
} );
