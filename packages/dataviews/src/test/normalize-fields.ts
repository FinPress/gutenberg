/**
 * Internal dependencies
 */
import { normalizeFields } from '../normalize-fields';
import type { Field } from '../types';

describe( 'normalizeFields: default getValue', () => {
	describe( 'getValue from ID', () => {
		it( 'name', () => {
			const item = { name: 2 };
			const fields: Field< {} >[] = [
				{
					id: 'name',
				},
			];
			const normalizedFields = normalizeFields( fields );
			const result = normalizedFields[ 0 ].getValue( { item } );
			expect( result ).toBe( 2 );
		} );

		it( 'user.name', () => {
			const item = { user: { name: 'Feynmann' } };
			const fields: Field< {} >[] = [
				{
					id: 'user.name',
				},
			];
			const normalizedFields = normalizeFields( fields );
			const result = normalizedFields[ 0 ].getValue( { item } );
			expect( result ).toBe( 'Feynmann' );
		} );

		it( 'users[0]', () => {
			const item = { users: [ 'Feynmann' ] };
			const fields: Field< {} >[] = [
				{
					id: 'users[0]',
				},
			];
			const normalizedFields = normalizeFields( fields );
			const result = normalizedFields[ 0 ].getValue( { item } );
			expect( result ).toBe( 'Feynmann' );
		} );

		it( 'users[0].name', () => {
			const item = { users: [ { name: 'Feynmann' } ] };
			const fields: Field< {} >[] = [
				{
					id: 'users[0].name',
				},
			];
			const normalizedFields = normalizeFields( fields );
			const result = normalizedFields[ 0 ].getValue( { item } );
			expect( result ).toBe( 'Feynmann' );
		} );
	} );
} );
