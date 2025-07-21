/**
 * Internal dependencies
 */
import nestedTagsFlattener from '../nested-tags-flattener';
import { deepFilterHTML } from '../utils';

describe( 'nestedTagsFlattener', () => {
	it( 'should flatten nested strong tags', () => {
		const input = '<strong>outer <strong>inner</strong> text</strong>';
		const expected = '<strong>outer inner text</strong>';
		expect( deepFilterHTML( input, [ nestedTagsFlattener ], {} ) ).toEqual(
			expected
		);
	} );

	it( 'should flatten deeply nested strong tags', () => {
		const input =
			'<strong>level1 <strong>level2 <strong>level3</strong> text</strong> more</strong>';
		const expected = '<strong>level1 level2 level3 text more</strong>';
		expect( deepFilterHTML( input, [ nestedTagsFlattener ], {} ) ).toEqual(
			expected
		);
	} );

	it( 'should remove nested anchor tags', () => {
		const input =
			'<a href="http://example.com">outer <a href="http://nested.com">inner</a> text</a>';
		const expected = '<a href="http://example.com">outer inner text</a>';
		expect( deepFilterHTML( input, [ nestedTagsFlattener ], {} ) ).toEqual(
			expected
		);
	} );

	it( 'should flatten nested em tags', () => {
		const input = '<em>outer <em>inner</em> text</em>';
		const expected = '<em>outer inner text</em>';
		expect( deepFilterHTML( input, [ nestedTagsFlattener ], {} ) ).toEqual(
			expected
		);
	} );

	it( 'should flatten nested b tags', () => {
		const input = '<b>outer <b>inner</b> text</b>';
		const expected = '<b>outer inner text</b>';
		expect( deepFilterHTML( input, [ nestedTagsFlattener ], {} ) ).toEqual(
			expected
		);
	} );

	it( 'should handle multiple nested tags of the same type', () => {
		const input =
			'<strong>start <strong>first</strong> middle <strong>second</strong> end</strong>';
		const expected = '<strong>start first middle second end</strong>';
		expect( deepFilterHTML( input, [ nestedTagsFlattener ], {} ) ).toEqual(
			expected
		);
	} );

	it( 'should handle mixed nested tags correctly', () => {
		const input =
			'<strong>bold <em>italic <strong>bold-italic</strong> more italic</em> more bold</strong>';
		const expected =
			'<strong>bold <em>italic bold-italic more italic</em> more bold</strong>';
		expect( deepFilterHTML( input, [ nestedTagsFlattener ], {} ) ).toEqual(
			expected
		);
	} );

	it( 'should not affect non-nested tags', () => {
		const input = '<strong>bold</strong> and <em>italic</em>';
		const expected = '<strong>bold</strong> and <em>italic</em>';
		expect( deepFilterHTML( input, [ nestedTagsFlattener ], {} ) ).toEqual(
			expected
		);
	} );

	it( 'should handle empty nested tags', () => {
		const input = '<strong>text <strong></strong> more</strong>';
		const expected = '<strong>text  more</strong>';
		expect( deepFilterHTML( input, [ nestedTagsFlattener ], {} ) ).toEqual(
			expected
		);
	} );

	it( 'should handle nested tags with attributes', () => {
		const input =
			'<strong class="outer">text <strong class="inner">nested</strong> more</strong>';
		const expected = '<strong class="outer">text nested more</strong>';
		expect( deepFilterHTML( input, [ nestedTagsFlattener ], {} ) ).toEqual(
			expected
		);
	} );

	it( 'should handle nested anchor tags with different hrefs', () => {
		const input =
			'<a href="http://example.com" class="outer">Click <a href="http://different.com" target="_blank">here</a> now</a>';
		const expected =
			'<a href="http://example.com" class="outer">Click here now</a>';
		expect( deepFilterHTML( input, [ nestedTagsFlattener ], {} ) ).toEqual(
			expected
		);
	} );

	it( 'should handle complex nested structure', () => {
		const input =
			'<div><strong>Bold <strong>nested bold</strong></strong> and <a href="http://example.com">Link <a href="http://nested.com">nested link</a></a></div>';
		const expected =
			'<div><strong>Bold nested bold</strong> and <a href="http://example.com">Link nested link</a></div>';
		expect( deepFilterHTML( input, [ nestedTagsFlattener ], {} ) ).toEqual(
			expected
		);
	} );

	it( 'should handle nested s (strikethrough) tags', () => {
		const input = '<s>strike <s>nested strike</s> text</s>';
		const expected = '<s>strike nested strike text</s>';
		expect( deepFilterHTML( input, [ nestedTagsFlattener ], {} ) ).toEqual(
			expected
		);
	} );

	it( 'should handle nested mark tags', () => {
		const input =
			'<mark>highlight <mark>nested highlight</mark> text</mark>';
		const expected = '<mark>highlight nested highlight text</mark>';
		expect( deepFilterHTML( input, [ nestedTagsFlattener ], {} ) ).toEqual(
			expected
		);
	} );
} );
