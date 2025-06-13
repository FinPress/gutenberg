/**
 * WordPress dependencies
 */
import { createRegistry } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { registerEntityField, unregisterEntityField } from '../private-actions';
import { store as editorStore } from '../../../store';
import { unlock } from '../../../lock-unlock';

function createRegistryWithStores() {
	// Create a registry.
	const registry = createRegistry();
	// Register stores.
	registry.register( editorStore );

	return registry;
}

describe( 'registerEntityField', () => {
	it( 'should be unlocked', () => {
		const registry = createRegistryWithStores();
		const action = unlock(
			registry.dispatch( editorStore )
		).registerEntityField( 'post', 'post', {
			id: 'post',
			label: 'Post',
			render: () => null,
			Edit: () => null,
		} );
		expect( action ).toBeDefined();
	} );

	it( 'should return the REGISTER_ENTITY_FIELD action', () => {
		const config = {
			id: 'post',
			label: 'Post',
			render: () => null,
			Edit: () => null,
		};
		const result = registerEntityField( 'post', 'post', config );
		expect( result ).toEqual( {
			type: 'REGISTER_ENTITY_FIELD',
			kind: 'post',
			name: 'post',
			config,
		} );
	} );
} );

describe( 'unregisterEntityField', () => {
	it( 'should be unlocked', () => {
		const registry = createRegistryWithStores();
		const action = unlock(
			registry.dispatch( editorStore )
		).unregisterEntityField( 'post', 'post', 'post' );
		expect( action ).toBeDefined();
	} );

	it( 'should return the UNREGISTER_ENTITY_FIELD action', () => {
		const result = unregisterEntityField( 'post', 'post', 'post' );
		expect( result ).toEqual( {
			type: 'UNREGISTER_ENTITY_FIELD',
			kind: 'post',
			name: 'post',
			fieldId: 'post',
		} );
	} );
} );
