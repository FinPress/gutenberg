/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Site Editor Inserter', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		// We need the theme to have a section root so zoom out is enabled
		await requestUtils.activateTheme( 'twentytwentyfour' );
	} );

	test.afterAll( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( 'twentytwentyone' );
	} );

	test.beforeEach( async ( { admin, editor } ) => {
		await admin.visitSiteEditor();
		await editor.canvas.locator( 'body' ).click();
	} );

	test.use( {
		InserterUtils: async ( { editor, page }, use ) => {
			await use( new InserterUtils( { editor, page } ) );
		},
	} );

	test.use( {
		ZoomUtils: async ( { editor, page }, use ) => {
			await use( new ZoomUtils( { editor, page } ) );
		},
	} );

	test( 'inserter toggle button should toggle global inserter', async ( {
		InserterUtils,
	} ) => {
		await InserterUtils.toggleBlockLibrary();

		// Visibility check
		await expect( InserterUtils.blockLibrary ).toBeVisible();
		await InserterUtils.toggleBlockLibrary();
		//Hidden State check
		await expect( InserterUtils.blockLibrary ).toBeHidden();
	} );

	// A test for https://github.com/WordPress/gutenberg/issues/43090.
	test( 'should close the inserter when clicking on the toggle button', async ( {
		editor,
		InserterUtils,
	} ) => {
		const beforeBlocks = await editor.getBlocks();

		await InserterUtils.toggleBlockLibrary();
		await InserterUtils.activateTab( 'Blocks' );
		await InserterUtils.blockLibrary
			.getByRole( 'option', { name: 'Buttons' } )
			.click();

		await expect
			.poll( editor.getBlocks )
			.toMatchObject( [ ...beforeBlocks, { name: 'core/buttons' } ] );

		await InserterUtils.toggleBlockLibrary();

		await expect( InserterUtils.blockLibrary ).toBeHidden();
	} );

	test( 'should open the inserter to patterns tab if using zoom out and stay in zoom out when closing the inserter', async ( {
		InserterUtils,
		ZoomUtils,
	} ) => {
		await ZoomUtils.toggleZoomLevel();
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();

		await InserterUtils.toggleBlockLibrary();
		await InserterUtils.expectActiveTab( 'Patterns' );
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();

		await InserterUtils.toggleBlockLibrary();

		await expect( InserterUtils.blockLibrary ).toBeHidden();

		// We should still be in Zoom Out
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();
	} );

	test( 'should enter zoom out from patterns tab and exit zoom out when closing the inserter', async ( {
		InserterUtils,
		ZoomUtils,
	} ) => {
		// Open inserter
		await InserterUtils.toggleBlockLibrary();
		await InserterUtils.expectActiveTab( 'Blocks' );
		await expect( ZoomUtils.zoomCanvas ).toBeHidden();

		await InserterUtils.activateTab( 'Patterns' );
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();

		await InserterUtils.toggleBlockLibrary();
		await expect( InserterUtils.blockLibrary ).toBeHidden();
		await expect( ZoomUtils.zoomCanvas ).toBeHidden();
	} );

	test( 'should always exit zoom out from blocks tab and does not change mode when closing the inserter', async ( {
		InserterUtils,
		ZoomUtils,
	} ) => {
		// Open inserter
		await InserterUtils.toggleBlockLibrary();
		await InserterUtils.expectActiveTab( 'Blocks' );
		await expect( ZoomUtils.zoomCanvas ).toBeHidden();

		// Click to patterns should enter zoom out
		await InserterUtils.activateTab( 'Patterns' );
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();

		// Click to blocks tab, zooms back in
		await InserterUtils.activateTab( 'Blocks' );
		await expect( ZoomUtils.zoomCanvas ).toBeHidden();

		// Close inserter
		await InserterUtils.toggleBlockLibrary();
		await expect( InserterUtils.blockLibrary ).toBeHidden();

		// Canvas stays zoomed in
		await expect( ZoomUtils.zoomCanvas ).toBeHidden();
	} );

	// Same test as above, but starting from zoom out
	test( 'should always exit zoom out from blocks tab and does not change mode when closing the inserter (even if starting from zoom out)', async ( {
		InserterUtils,
		ZoomUtils,
	} ) => {
		await ZoomUtils.toggleZoomLevel();
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();

		// Open inserter
		await InserterUtils.toggleBlockLibrary();
		await expect( InserterUtils.blockLibrary ).toBeVisible();

		// Patterns tab should be active
		await InserterUtils.activateTab( 'Patterns' );
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();

		// Click to blocks tab, zooms back in
		await InserterUtils.activateTab( 'Blocks' );
		await expect( ZoomUtils.zoomCanvas ).toBeHidden();

		// Close inserter
		await InserterUtils.toggleBlockLibrary();
		await expect( InserterUtils.blockLibrary ).toBeHidden();

		// Canvas stays zoomed in
		await expect( ZoomUtils.zoomCanvas ).toBeHidden();
	} );

	// Same test as above but exiting from zoom out
	test( 'If we change the zoom level for them via an inserter tab change, always exit zoom out when closing the inserter', async ( {
		InserterUtils,
		ZoomUtils,
	} ) => {
		await ZoomUtils.toggleZoomLevel();
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();

		await InserterUtils.toggleBlockLibrary();

		// Should start with pattern tab selected in zoom out state
		await InserterUtils.expectActiveTab( 'Patterns' );
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();

		// Go to blocks tab which should exit zoom out
		await InserterUtils.activateTab( 'Blocks' );
		await expect( ZoomUtils.zoomCanvas ).toBeHidden();

		// Go to media tab which should enter zoom out again since that's the starting state
		await InserterUtils.activateTab( 'Media' );
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();

		// Close the inserter
		await InserterUtils.toggleBlockLibrary();
		await expect( InserterUtils.blockLibrary ).toBeHidden();

		// We should stay in zoomed out state since we had control over the zoom state and we always exit zoom out when closing the inserter
		await expect( ZoomUtils.zoomCanvas ).toBeHidden();
	} );

	test( 'should always exit zoom out if we have most recently changed zoom level for them', async ( {
		InserterUtils,
		ZoomUtils,
	} ) => {
		// Enter zoom out
		await ZoomUtils.toggleZoomLevel();
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();
		// Open inserter
		await InserterUtils.toggleBlockLibrary();

		// Patterns tab should be active
		await InserterUtils.activateTab( 'Patterns' );
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();

		// Click to blocks tab, zooms back in
		await InserterUtils.activateTab( 'Blocks' );
		await expect( ZoomUtils.zoomCanvas ).toBeHidden();

		// Click to media tab, to zoom back out
		await InserterUtils.activateTab( 'Media' );
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();

		// Close inserter
		await InserterUtils.toggleBlockLibrary();
		await expect( InserterUtils.blockLibrary ).toBeHidden();

		// We have taken over zoom state control, so we should exit for them.
		await expect( ZoomUtils.zoomCanvas ).toBeHidden();
	} );

	// Test for https://github.com/WordPress/gutenberg/issues/66328
	test( 'should not return you to zoom out if manually disengaged', async ( {
		InserterUtils,
		ZoomUtils,
	} ) => {
		await ZoomUtils.toggleZoomLevel();
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();

		await InserterUtils.toggleBlockLibrary();
		await expect( InserterUtils.blockLibrary ).toBeVisible();

		await InserterUtils.activateTab( 'Patterns' );
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();

		await ZoomUtils.toggleZoomLevel();
		await expect( ZoomUtils.zoomCanvas ).toBeHidden();

		// Close the inserter
		await InserterUtils.toggleBlockLibrary();
		await expect( InserterUtils.blockLibrary ).toBeHidden();

		// We should not return to zoom out since it was manually disengaged
		await expect( ZoomUtils.zoomCanvas ).toBeHidden();
	} );

	// Similar test to the above but toggle zoom level twice
	test( 'starting from default view, should not toggle zoom state from pattern tab when closing the inserter if the user manually changed zoom state tweice', async ( {
		InserterUtils,
		ZoomUtils,
	} ) => {
		// Open inserter
		await InserterUtils.toggleBlockLibrary();
		await expect( InserterUtils.blockLibrary ).toBeVisible();

		await InserterUtils.activateTab( 'Blocks' );
		await expect( ZoomUtils.zoomCanvas ).toBeHidden();

		// Go to patterns tab which should enter zoom out
		await InserterUtils.activateTab( 'Patterns' );
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();

		// Manually toggle zoom out off
		await ZoomUtils.toggleZoomLevel();
		await expect( ZoomUtils.zoomCanvas ).toBeHidden();

		// Manually toggle zoom out again to return to zoomed-in state set by the patterns tab.
		await ZoomUtils.toggleZoomLevel();
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();

		// Close the inserter
		await InserterUtils.toggleBlockLibrary();
		await expect( InserterUtils.blockLibrary ).toBeHidden();

		// We should stay in zoomed out state since it was manually engaged
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();
	} );

	test( 'starting from zoomed out, should not toggle zoom state when closing the inserter if the user manually changed zoom state twice', async ( {
		InserterUtils,
		ZoomUtils,
	} ) => {
		// Enter zoom out
		await ZoomUtils.toggleZoomLevel();
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();

		// Open inserter
		await InserterUtils.toggleBlockLibrary();
		await expect( InserterUtils.blockLibrary ).toBeVisible();

		// Go to patterns tab which should remain in zoom out
		await InserterUtils.activateTab( 'Patterns' );
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();

		// Manually toggle zoom out off
		await ZoomUtils.toggleZoomLevel();
		await expect( ZoomUtils.zoomCanvas ).toBeHidden();

		// Manually toggle zoom out again to return to zoomed-in state set by the patterns tab.
		await ZoomUtils.toggleZoomLevel();
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();

		// Close the inserter
		await InserterUtils.toggleBlockLibrary();
		await expect( InserterUtils.blockLibrary ).toBeHidden();

		// We should stay in zoomed out state since it was manually engaged
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();
	} );

	// Similar to above ones, but doing it from the blocks tab (zoomed out) to zoom in
	test( 'should not reset zoom level if zoom level manually toggled from blocks tab', async ( {
		InserterUtils,
		ZoomUtils,
	} ) => {
		await InserterUtils.toggleBlockLibrary();
		await expect( InserterUtils.blockLibrary ).toBeVisible();

		await InserterUtils.expectActiveTab( 'Blocks' );
		await expect( ZoomUtils.zoomCanvas ).toBeHidden();

		await ZoomUtils.toggleZoomLevel();
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();

		// Close the inserter
		await InserterUtils.toggleBlockLibrary();
		await expect( InserterUtils.blockLibrary ).toBeHidden();

		// We should not return to zoom in since it was manually disengaged
		await expect( ZoomUtils.zoomCanvas ).toBeVisible();
	} );
} );

class InserterUtils {
	constructor( { editor, page } ) {
		this.editor = editor;
		this.page = page;
		this.blockLibrary = this.page.getByRole( 'region', {
			name: 'Block Library',
		} );
		this.inserterButton = this.page.getByRole( 'button', {
			name: 'Block Inserter',
			exact: true,
		} );
		this.blocksTab = this.getBlockLibraryTab( 'Blocks' );
		this.patternsTab = this.getBlockLibraryTab( 'Patterns' );
		this.mediaTab = this.getBlockLibraryTab( 'Media' );
	}

	async toggleBlockLibrary() {
		await this.inserterButton.click();
	}

	getBlockLibraryTab( name ) {
		return this.page.getByRole( 'tab', { name } );
	}

	async expectActiveTab( name ) {
		await expect( this.getBlockLibraryTab( name ) ).toHaveAttribute(
			'data-active-item',
			'true'
		);
	}

	async activateTab( name ) {
		await this.getBlockLibraryTab( name ).click();
		// For brevity, adding this check here. It should always be done after the tab is clicked
		await this.expectActiveTab( name );
	}
}

class ZoomUtils {
	constructor( { editor, page } ) {
		this.editor = editor;
		this.page = page;
		this.zoomCanvas = this.page.locator( '.is-zoomed-out' );
		this.zoomButton = this.page.getByRole( 'button', {
			name: 'Zoom Out',
			exact: true,
		} );
	}

	async toggleZoomLevel() {
		await this.zoomButton.click();
	}
}
