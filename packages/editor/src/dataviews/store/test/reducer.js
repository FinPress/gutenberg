/**
 * Internal dependencies
 */
import { fields } from '../reducer';

describe( 'fields', () => {
	it( 'should return the initial state', () => {
		expect(
			fields( undefined, {
				type: 'REGISTER_ENTITY_FIELD',
				kind: 'post',
				name: 'post',
				config: { id: 'post', label: 'Post' },
			} )
		).toEqual( {
			post: {
				post: [ { id: 'post', label: 'Post' } ],
			},
		} );
	} );

	it( 'should unregister an entity field', () => {
		const state = {
			post: {
				post: [ { id: 'post', label: 'Post' } ],
			},
		};

		expect(
			fields( state, {
				type: 'UNREGISTER_ENTITY_FIELD',
				kind: 'post',
				name: 'post',
				fieldId: 'post',
			} )
		).toEqual( {
			post: {
				post: [],
			},
		} );
	} );
} );
