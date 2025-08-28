/**
 * WordPress dependencies
 */
import { create } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import { matchAutocompleters } from '../autocompleter-matcher';
import type { WPCompleter } from '../types';

// Mock the autocompleter-ui module
jest.mock( '../autocompleter-ui', () => ( {
	getAutoCompleterUI: jest.fn(
		( completer ) => () => `MockUI-${ completer.name }`
	),
} ) );

// Mock external dependencies
jest.mock( 'remove-accents', () => ( text: string ) => text );

describe( 'matchAutocompleters', () => {
	const mockCompleters: WPCompleter[] = [
		{
			name: 'user',
			triggerPrefix: '@',
			options: [ { value: 'john', label: 'John Doe' } ],
			getOptionLabel: ( option: any ) => option.label,
		},
		{
			name: 'hashtag',
			triggerPrefix: '#',
			options: [ { value: 'javascript', label: 'JavaScript' } ],
			getOptionLabel: ( option: any ) => option.label,
		},
		{
			name: 'block',
			triggerPrefix: '/',
			options: [ { value: 'paragraph', label: 'Paragraph' } ],
			getOptionLabel: ( option: any ) => option.label,
		},
	];

	const createRecord = ( text: string, start?: number, end?: number ) => {
		const record = create( { text } );
		if ( start !== undefined ) {
			record.start = start;
		}
		if ( end !== undefined ) {
			record.end = end;
		}
		return record;
	};

	const defaultOptions = {
		textContent: '',
		completers: mockCompleters,
		currentFilteredOptionsLength: 0,
		isBackspacing: false,
		currentAutocompleter: null,
		currentAutocompleterUI: null,
		record: createRecord( '' ),
	};

	describe( 'basic matching', () => {
		it( 'should return reset when no text content', () => {
			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: '',
			} );

			expect( result ).toEqual( {
				completer: null,
				filterValue: '',
				shouldReset: true,
				AutocompleterUI: null,
			} );
		} );

		it( 'should return reset when no completer matches', () => {
			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: 'Hello world',
			} );

			expect( result ).toEqual( {
				completer: null,
				filterValue: '',
				shouldReset: true,
				AutocompleterUI: null,
			} );
		} );

		it( 'should match the correct completer based on trigger prefix', () => {
			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: 'Hello @john',
			} );

			expect( result.completer ).toBe( mockCompleters[ 0 ] );
			expect( result.filterValue ).toBe( 'john' );
			expect( result.shouldReset ).toBe( false );
			expect( result.AutocompleterUI ).toBeDefined();
		} );

		it( 'should prefer the latest trigger when multiple are present', () => {
			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: 'Hello @john and #javascript',
			} );

			expect( result.completer ).toBe( mockCompleters[ 1 ] ); // hashtag completer
			expect( result.filterValue ).toBe( 'javascript' );
		} );

		it( 'should extract filter value correctly', () => {
			const testCases = [
				{ text: '@jo', expected: 'jo' },
				{ text: '@', expected: '' },
				{ text: '@john doe', expected: '' },
				{ text: '#tag', expected: 'tag' },
			];

			testCases.forEach( ( { text, expected } ) => {
				const result = matchAutocompleters( {
					...defaultOptions,
					textContent: text,
				} );

				expect( result.filterValue ).toBe( expected );
			} );
		} );
	} );

	describe( 'distance limiting', () => {
		it( 'should not match when too distant from trigger (>50 chars)', () => {
			const longText = 'a'.repeat( 51 );
			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: `@${ longText }`,
			} );

			expect( result ).toEqual( {
				completer: null,
				filterValue: '',
				shouldReset: false, // Should not reset, just ignore
				AutocompleterUI: null,
			} );
		} );

		it( 'should match when within distance limit (<=50 chars)', () => {
			const text = 'a'.repeat( 50 );
			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: `@${ text }`,
			} );

			expect( result.completer ).toBe( mockCompleters[ 0 ] );
			expect( result.filterValue ).toBe( text );
		} );
	} );

	describe( 'mismatch handling', () => {
		it( 'should reset on mismatch when not in valid scenarios', () => {
			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: '@john doe invalid',
				currentFilteredOptionsLength: 0, // Indicates mismatch
				isBackspacing: false,
			} );

			expect( result.shouldReset ).toBe( true );
		} );

		it( 'should allow matching with one trigger word even on mismatch', () => {
			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: '@john',
				currentFilteredOptionsLength: 0, // Indicates mismatch
				isBackspacing: false,
			} );

			expect( result.shouldReset ).toBe( false );
			expect( result.completer ).toBe( mockCompleters[ 0 ] );
		} );

		it( 'should allow matching while backspacing with up to 3 words', () => {
			const testCases = [ '@john', '@john doe', '@john doe smith' ];

			testCases.forEach( ( text ) => {
				const result = matchAutocompleters( {
					...defaultOptions,
					textContent: text,
					currentFilteredOptionsLength: 0, // Indicates mismatch
					isBackspacing: true,
				} );

				expect( result.shouldReset ).toBe( false );
				expect( result.completer ).toBe( mockCompleters[ 0 ] );
			} );
		} );

		it( 'should reset while backspacing with more than 3 words', () => {
			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: '@john doe smith jones',
				currentFilteredOptionsLength: 0, // Indicates mismatch
				isBackspacing: true,
			} );

			expect( result.shouldReset ).toBe( true );
		} );
	} );

	describe( 'context validation', () => {
		it( 'should respect allowContext when provided', () => {
			const completerWithContext: WPCompleter = {
				...mockCompleters[ 0 ],
				allowContext: ( before: string ) => {
					return before.includes( 'allowed' );
				},
			};

			const completersWithContext = [ completerWithContext ];

			// Should match when context is allowed
			const allowedResult = matchAutocompleters( {
				...defaultOptions,
				textContent: 'This is allowed @john',
				completers: completersWithContext,
			} );

			expect( allowedResult.completer ).toBe( completerWithContext );
			expect( allowedResult.shouldReset ).toBe( false );

			// Should reset when context is not allowed
			const notAllowedResult = matchAutocompleters( {
				...defaultOptions,
				textContent: 'This is not @john',
				completers: completersWithContext,
			} );

			expect( notAllowedResult.shouldReset ).toBe( true );
		} );
	} );

	describe( 'text format validation', () => {
		it( 'should reset when text starts with whitespace', () => {
			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: '@ john',
			} );

			expect( result.shouldReset ).toBe( true );
		} );

		it( 'should reset when text ends with multiple whitespaces', () => {
			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: '@john  ',
			} );

			expect( result.shouldReset ).toBe( true );
		} );

		it( 'should not allow single trailing whitespace', () => {
			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: '@john ',
			} );

			expect( result.shouldReset ).toBe( true );
			expect( result.completer ).toBe( null );
		} );
	} );

	describe( 'UI component handling', () => {
		it( 'should get new UI when completer changes', () => {
			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: '@john',
				currentAutocompleter: mockCompleters[ 1 ], // Different completer
			} );

			expect( result.AutocompleterUI ).toBeDefined();
			// Should get new UI since completer changed
		} );

		it( 'should reuse current UI when completer is the same', () => {
			const mockUI = () => null;
			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: '@john',
				currentAutocompleter: mockCompleters[ 0 ], // Same completer
				currentAutocompleterUI: mockUI,
			} );

			expect( result.AutocompleterUI ).toBe( mockUI );
		} );
	} );

	describe( 'edge cases', () => {
		it( 'should handle empty trigger prefix', () => {
			const emptyTriggerCompleter: WPCompleter = {
				name: 'empty',
				triggerPrefix: '',
				options: [],
				getOptionLabel: ( option: any ) => option.label,
			};

			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: 'some text',
				completers: [ emptyTriggerCompleter ],
			} );

			expect( result.completer ).toBe( emptyTriggerCompleter );
		} );

		it( 'should handle special characters in trigger prefix', () => {
			const specialCompleter: WPCompleter = {
				name: 'special',
				triggerPrefix: '[',
				options: [],
				getOptionLabel: ( option: any ) => option.label,
			};

			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: 'test [bracket',
				completers: [ specialCompleter ],
			} );

			expect( result.completer ).toBe( specialCompleter );
			expect( result.filterValue ).toBe( 'bracket' );
		} );

		it( 'should handle unicode characters', () => {
			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: '@café',
			} );

			expect( result.completer ).toBe( mockCompleters[ 0 ] );
			expect( result.filterValue ).toBe( 'café' );
		} );

		it( 'should handle multiple instances of same trigger', () => {
			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: '@first @second',
			} );

			expect( result.completer ).toBe( mockCompleters[ 0 ] );
			expect( result.filterValue ).toBe( 'second' ); // Should use the latest
		} );
	} );

	describe( 'performance scenarios', () => {
		it( 'should handle very long text before trigger efficiently', () => {
			const longPrefix = 'a'.repeat( 1000 );
			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: `${ longPrefix } @john`,
			} );

			expect( result.completer ).toBe( mockCompleters[ 0 ] );
			expect( result.filterValue ).toBe( 'john' );
		} );

		it( 'should reject extremely long filter values', () => {
			const longText = 'a'.repeat( 100 );
			const result = matchAutocompleters( {
				...defaultOptions,
				textContent: `@${ longText }`,
			} );

			expect( result.shouldReset ).toBe( false );
			expect( result.completer ).toBe( null );
		} );
	} );
} );
