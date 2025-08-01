/**
 * Internal dependencies
 */
import { flattenNestedTags } from '../flatten-nested-tags';

describe( 'flattenNestedTags', () => {
	it( 'should flatten nested strong tags', () => {
		const input = '<strong>outer <strong>inner</strong> text</strong>';
		const expected = '<strong>outer inner text</strong>';
		expect( flattenNestedTags( input ) ).toEqual( expected );
	} );

	it( 'should flatten nested anchor tags', () => {
		const input =
			'<a href="http://outer.com">outer <a href="http://inner.com">inner</a> text</a>';
		const expected = '<a href="http://outer.com">outer inner text</a>';
		expect( flattenNestedTags( input ) ).toEqual( expected );
	} );

	it( 'should handle deeply nested tags', () => {
		const input =
			'<strong>level1 <strong>level2 <strong>level3</strong> text</strong> more</strong>';
		const expected = '<strong>level1 level2 level3 text more</strong>';
		expect( flattenNestedTags( input ) ).toEqual( expected );
	} );

	it( 'should handle multiple nested instances', () => {
		const input =
			'Text with <strong>first <strong>nested</strong> bold</strong> and <strong>second <strong>nested</strong> bold</strong>';
		const expected =
			'Text with <strong>first nested bold</strong> and <strong>second nested bold</strong>';
		expect( flattenNestedTags( input ) ).toEqual( expected );
	} );

	it( 'should preserve content without nested tags', () => {
		const input =
			'<strong>bold</strong> and <a href="http://example.com">link</a>';
		const expected =
			'<strong>bold</strong> and <a href="http://example.com">link</a>';
		expect( flattenNestedTags( input ) ).toEqual( expected );
	} );

	it( 'should handle mixed nested content', () => {
		const input =
			'<strong>bold <a href="http://example.com">link <strong>nested bold</strong> link</a> bold</strong>';
		const expected =
			'<strong>bold <a href="http://example.com">link nested bold link</a> bold</strong>';
		expect( flattenNestedTags( input ) ).toEqual( expected );
	} );

	it( 'should handle empty string', () => {
		expect( flattenNestedTags( '' ) ).toEqual( '' );
	} );

	it( 'should handle string without HTML tags', () => {
		const input = 'Just plain text without any tags';
		expect( flattenNestedTags( input ) ).toEqual( input );
	} );
} );
