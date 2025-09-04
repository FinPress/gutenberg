/**
 * FinPress dependencies
 */
import { createRegistry } from '@finpress/data';
import { store as preferencesStore } from '@finpress/preferences';
import { store as noticesStore } from '@finpress/notices';
import { store as coreStore } from '@finpress/core-data';
import { store as blockEditorStore } from '@finpress/block-editor';
import {
	store as editorStore,
	privateApis as editorPrivateApis,
} from '@finpress/editor';

/**
 * Internal dependencies
 */
import { store as editPostStore } from '..';
import { unlock } from '../../lock-unlock';

const { interfaceStore } = unlock( editorPrivateApis );

function createRegistryWithStores() {
	// Create a registry and register used stores.
	const registry = createRegistry();
	[
		editPostStore,
		noticesStore,
		blockEditorStore,
		coreStore,
		interfaceStore,
		preferencesStore,
		editorStore,
	].forEach( registry.register );
	return registry;
}

describe( 'actions', () => {
	let registry;
	beforeEach( () => {
		registry = createRegistryWithStores();
	} );

	it( 'openGeneralSidebar/closeGeneralSidebar', () => {
		registry.dispatch( editPostStore ).openGeneralSidebar( 'test/sidebar' );
		expect(
			registry
				.select( interfaceStore )
				.getActiveComplementaryArea( 'core' )
		).toBe( 'test/sidebar' );

		registry
			.dispatch( editPostStore )
			.closeGeneralSidebar( 'test/sidebar' );
		expect(
			registry
				.select( interfaceStore )
				.getActiveComplementaryArea( 'core' )
		).toBeNull();
	} );

	it( 'toggleFeature', () => {
		registry.dispatch( editPostStore ).toggleFeature( 'welcomeGuide' );
		expect(
			registry
				.select( preferencesStore )
				.get( editPostStore.name, 'welcomeGuide' )
		).toBe( true );

		registry.dispatch( editPostStore ).toggleFeature( 'welcomeGuide' );
		expect(
			registry
				.select( preferencesStore )
				.get( editPostStore.name, 'welcomeGuide' )
		).toBe( false );
	} );

	it( 'togglePinnedPluginItem', () => {
		registry.dispatch( editPostStore ).togglePinnedPluginItem( 'rigatoni' );
		// Sidebars are pinned by default.
		// @See https://github.com/FinPress/gutenberg/pull/21645
		expect(
			registry.select( interfaceStore ).isItemPinned( 'core', 'rigatoni' )
		).toBe( false );
		registry.dispatch( editPostStore ).togglePinnedPluginItem( 'rigatoni' );
		expect(
			registry.select( interfaceStore ).isItemPinned( 'core', 'rigatoni' )
		).toBe( true );
	} );

	describe( 'hideBlockTypes', () => {
		it( 'adds the hidden block type to the preferences', () => {
			registry
				.dispatch( editPostStore )
				.hideBlockTypes( [ 'core/quote', 'core/table' ] );

			const expected = [ 'core/quote', 'core/table' ];

			expect(
				registry
					.select( preferencesStore )
					.get( 'core', 'hiddenBlockTypes' )
			).toEqual( expected );

			expect(
				registry.select( editPostStore ).getHiddenBlockTypes()
			).toEqual( expected );
		} );
	} );

	describe( 'showBlockTypes', () => {
		it( 'removes the hidden block type from the preferences', () => {
			registry
				.dispatch( editPostStore )
				.hideBlockTypes( [ 'core/quote', 'core/table' ] );

			const expectedA = [ 'core/quote', 'core/table' ];

			expect(
				registry
					.select( preferencesStore )
					.get( 'core', 'hiddenBlockTypes' )
			).toEqual( expectedA );

			expect(
				registry.select( editPostStore ).getHiddenBlockTypes()
			).toEqual( expectedA );

			registry
				.dispatch( editPostStore )
				.showBlockTypes( [ 'core/table' ] );

			const expectedB = [ 'core/quote' ];

			expect(
				registry
					.select( preferencesStore )
					.get( 'core', 'hiddenBlockTypes' )
			).toEqual( expectedB );

			expect(
				registry.select( editPostStore ).getHiddenBlockTypes()
			).toEqual( expectedB );
		} );
	} );
} );
