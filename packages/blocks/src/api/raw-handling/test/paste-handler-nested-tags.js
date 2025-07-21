/**
 * Internal dependencies
 */
import { pasteHandler } from '../paste-handler';

describe( 'pasteHandler nested tags fix', () => {
	it( 'should fix nested strong tags in paste content', () => {
		const input = '<strong>outer <strong>inner</strong> text</strong>';
		const result = pasteHandler( {
			HTML: input,
			mode: 'INLINE',
		} );

		// Should combine nested strong tags into a single strong tag
		expect( result ).toEqual( '<strong>outer inner text</strong>' );
		expect( console ).toHaveLogged();
	} );

	it( 'should fix deeply nested strong tags', () => {
		const input =
			'<strong>level1 <strong>level2 <strong>level3</strong> text</strong> more</strong>';
		const result = pasteHandler( {
			HTML: input,
			mode: 'INLINE',
		} );

		expect( result ).toEqual(
			'<strong>level1 level2 level3 text more</strong>'
		);
		expect( console ).toHaveLogged();
	} );

	it( 'should fix nested anchor tags in paste content', () => {
		const input =
			'<a href="http://example.com">outer <a href="http://nested.com">inner</a> text</a>';
		const result = pasteHandler( {
			HTML: input,
			mode: 'INLINE',
		} );

		// Should remove inner anchor tag but keep content
		expect( result ).toEqual(
			'<a href="http://example.com">outer inner text</a>'
		);
		expect( console ).toHaveLogged();
	} );

	it( 'should fix multiple nested strong tags', () => {
		const input =
			'Text with <strong>first <strong>nested</strong> bold</strong> and <strong>second <strong>nested</strong> bold</strong>';
		const result = pasteHandler( {
			HTML: input,
			mode: 'INLINE',
		} );

		expect( result ).toEqual(
			'Text with <strong>first nested bold</strong> and <strong>second nested bold</strong>'
		);
		expect( console ).toHaveLogged();
	} );

	it( 'should handle mixed nested content', () => {
		const input =
			'<strong>bold <a href="http://example.com">link <strong>nested bold</strong> link</a> bold</strong>';
		const result = pasteHandler( {
			HTML: input,
			mode: 'INLINE',
		} );

		// The strong tags should be flattened, link should remain
		expect( result ).toEqual(
			'<strong>bold <a href="http://example.com">link nested bold link</a> bold</strong>'
		);
		expect( console ).toHaveLogged();
	} );

	it( 'should not affect non-nested tags', () => {
		const input =
			'<strong>bold</strong> and <a href="http://example.com">link</a>';
		const result = pasteHandler( {
			HTML: input,
			mode: 'INLINE',
		} );

		// Should remain unchanged
		expect( result ).toEqual(
			'<strong>bold</strong> and <a href="http://example.com">link</a>'
		);
		expect( console ).toHaveLogged();
	} );
} );
