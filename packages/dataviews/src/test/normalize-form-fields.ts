/**
 * Internal dependencies
 */
import normalizeFormFields from '../normalize-form-fields';
import type { Form } from '../types';

describe( 'normalizeFormFields', () => {
	describe( 'empty form', () => {
		it( 'returns empty array for undefined fields', () => {
			const form: Form = [];
			const result = normalizeFormFields( form );
			expect( result ).toEqual( [] );
		} );

		it( 'returns empty array for empty fields', () => {
			const form: Form = [];
			const result = normalizeFormFields( form );
			expect( result ).toEqual( [] );
		} );
	} );

	describe( 'default layout', () => {
		it( 'applies default layout when layout is not specified', () => {
			const form: Form = [ 'field1', 'field2' ];
			const result = normalizeFormFields( form );
			expect( result ).toEqual( [
				{
					id: 'field1',
					layout: { type: 'regular', labelPosition: 'top' },
				},
				{
					id: 'field2',
					layout: { type: 'regular', labelPosition: 'top' },
				},
			] );
		} );

		it( 'handles mixed string and object field specifications', () => {
			const form: Form = [
				'field1',
				{
					id: 'field2',
					label: 'Field 2',
				},
			];
			const result = normalizeFormFields( form );
			expect( result ).toEqual( [
				{
					id: 'field1',
					layout: { type: 'regular', labelPosition: 'top' },
				},
				{
					id: 'field2',
					label: 'Field 2',
					layout: { type: 'regular', labelPosition: 'top' },
				},
			] );
		} );
	} );

	describe( 'layout types', () => {
		it( 'regular: with default layout options', () => {
			const form: Form = [ 'field1' ];
			const result = normalizeFormFields( form );
			expect( result ).toEqual( [
				{
					id: 'field1',
					layout: { type: 'regular', labelPosition: 'top' },
				},
			] );
		} );

		it( 'regular: with layout options', () => {
			const form: Form = [
				{
					id: 'field1',
					layout: { type: 'regular', labelPosition: 'side' },
				},
			];
			const result = normalizeFormFields( form );
			expect( result ).toEqual( [
				{
					id: 'field1',
					layout: { type: 'regular', labelPosition: 'side' },
				},
			] );
		} );

		it( 'panel: with default layout options', () => {
			const form: Form = [ { id: 'field1', layout: { type: 'panel' } } ];
			const result = normalizeFormFields( form );
			expect( result ).toEqual( [
				{
					id: 'field1',
					layout: { type: 'panel', labelPosition: 'side' },
				},
			] );
		} );

		it( 'panel: with layout options', () => {
			const form: Form = [
				{
					id: 'field1',
					layout: { type: 'panel', labelPosition: 'top' },
				},
			];
			const result = normalizeFormFields( form );
			expect( result ).toEqual( [
				{
					id: 'field1',
					layout: { type: 'panel', labelPosition: 'top' },
				},
			] );
		} );

		it( 'card: with default layout options', () => {
			const form: Form = [ { id: 'field1', layout: { type: 'card' } } ];
			const result = normalizeFormFields( form );
			expect( result ).toEqual( [
				{
					id: 'field1',
					layout: {
						type: 'card',
						withHeader: true,
						isOpened: true,
					},
				},
			] );
		} );

		it( 'card: enforces isOpened=true when withHeader=false', () => {
			const form: Form = [
				{
					id: 'field1',
					layout: {
						type: 'card',
						withHeader: false,
						// @ts-ignore - Test intentionally uses invalid type to verify runtime behavior.
						isOpened: false,
					},
				},
			];
			const result = normalizeFormFields( form );
			expect( result ).toEqual( [
				{
					id: 'field1',
					layout: {
						type: 'card',
						withHeader: false,
						isOpened: true,
					},
				},
			] );
		} );

		it( 'card: respects isOpened when withHeader=true', () => {
			const form: Form = [
				{
					id: 'field1',
					layout: { type: 'card', withHeader: true, isOpened: false },
				},
			];
			const result = normalizeFormFields( form );
			expect( result ).toEqual( [
				{
					id: 'field1',
					layout: {
						type: 'card',
						withHeader: true,
						isOpened: false,
					},
				},
			] );
		} );
	} );

	describe( 'layout overrides', () => {
		it( 'fields can override form layout', () => {
			const form: Form = [
				{
					id: 'field1',
					layout: { type: 'regular', labelPosition: 'top' },
				},
				{
					id: 'field2',
					layout: { type: 'panel', labelPosition: 'side' },
				},
			];
			const result = normalizeFormFields( form );
			expect( result ).toEqual( [
				{
					id: 'field1',
					layout: { type: 'regular', labelPosition: 'top' },
				},
				{
					id: 'field2',
					layout: { type: 'panel', labelPosition: 'side' },
				},
			] );
		} );

		it( 'fields do not partially override form layout', () => {
			const form: Form = [
				{
					id: 'field1',
					layout: { type: 'card', withHeader: false, isOpened: true },
				},
				{
					id: 'field2',
					layout: { type: 'card', isOpened: false },
				},
			];
			const result = normalizeFormFields( form );
			expect( result ).toEqual( [
				{
					id: 'field1',
					layout: {
						type: 'card',
						withHeader: false,
						isOpened: true,
					},
				},
				{
					id: 'field2',
					layout: {
						type: 'card',
						withHeader: true,
						isOpened: false,
					},
				},
			] );
		} );
	} );
} );
