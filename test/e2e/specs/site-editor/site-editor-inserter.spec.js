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

	test( 'inserter toggle button should toggle global inserter', async ( {
		InserterUtils,
	} ) => {
		const inserterButton = InserterUtils.getInserterButton();

		await inserterButton.click();

		const blockLibrary = InserterUtils.getBlockLibrary();

		// Visibility check
		await expect( blockLibrary ).toBeVisible();
		await inserterButton.click();
		//Hidden State check
		await expect( blockLibrary ).toBeHidden();
	} );

	// A test for https://github.com/WordPress/gutenberg/issues/43090.
	test( 'should close the inserter when clicking on the toggle button', async ( {
		editor,
		InserterUtils,
	} ) => {
		const inserterButton = InserterUtils.getInserterButton();
		const blockLibrary = InserterUtils.getBlockLibrary();

		const beforeBlocks = await editor.getBlocks();

		await inserterButton.click();
		await InserterUtils.getBlockLibraryTab( 'Blocks' ).click();
		await blockLibrary.getByRole( 'option', { name: 'Buttons' } ).click();

		await expect
			.poll( editor.getBlocks )
			.toMatchObject( [ ...beforeBlocks, { name: 'core/buttons' } ] );

		await inserterButton.click();

		await expect( blockLibrary ).toBeHidden();
	} );

	test( 'should open the inserter to patterns tab if using zoom out and stay in zoom out when closing the inserter', async ( {
		InserterUtils,
	} ) => {
		const zoomOutButton = InserterUtils.getZoomOutButton();
		const inserterButton = InserterUtils.getInserterButton();
		const blockLibrary = InserterUtils.getBlockLibrary();

		await zoomOutButton.click();
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();

		await inserterButton.click();
		const patternsTab = InserterUtils.getBlockLibraryTab( 'Patterns' );
		await expect( patternsTab ).toHaveAttribute(
			'data-active-item',
			'true'
		);
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();

		await inserterButton.click();

		await expect( blockLibrary ).toBeHidden();

		// We should still be in Zoom Out
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();
	} );

	test( 'should enter zoom out from patterns tab and exit zoom out when closing the inserter', async ( {
		InserterUtils,
	} ) => {
		const inserterButton = InserterUtils.getInserterButton();
		const blockLibrary = InserterUtils.getBlockLibrary();

		await inserterButton.click();
		await expect( blockLibrary ).toBeVisible();
		await expect( await InserterUtils.getZoomCanvas() ).toBeHidden();

		const blocksTab = InserterUtils.getBlockLibraryTab( 'Blocks' );
		await expect( blocksTab ).toHaveAttribute( 'data-active-item', 'true' );

		const patternsTab = InserterUtils.getBlockLibraryTab( 'Patterns' );
		await patternsTab.click();
		await expect( patternsTab ).toHaveAttribute(
			'data-active-item',
			'true'
		);
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();

		await inserterButton.click();
		await expect( blockLibrary ).toBeHidden();

		await expect( await InserterUtils.getZoomCanvas() ).toBeHidden();
	} );

	test( 'should always exit zoom out from blocks tab and does not change mode when closing the inserter', async ( {
		InserterUtils,
	} ) => {
		const inserterButton = InserterUtils.getInserterButton();
		const blockLibrary = InserterUtils.getBlockLibrary();

		// Open inserter
		await inserterButton.click();
		await expect( blockLibrary ).toBeVisible();

		// Blocks tab should be active, not in zoomed out state
		const blocksTab = InserterUtils.getBlockLibraryTab( 'Blocks' );
		await expect( blocksTab ).toHaveAttribute( 'data-active-item', 'true' );
		await expect( await InserterUtils.getZoomCanvas() ).toBeHidden();

		// Click to patterns, should enter zoom out
		const patternsTab = InserterUtils.getBlockLibraryTab( 'Patterns' );
		await patternsTab.click();
		await expect( patternsTab ).toHaveAttribute(
			'data-active-item',
			'true'
		);
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();

		// Click to blocks tab, zooms back in
		await blocksTab.click();
		await expect( blocksTab ).toHaveAttribute( 'data-active-item', 'true' );
		await expect( await InserterUtils.getZoomCanvas() ).toBeHidden();

		// Close inserter
		await inserterButton.click();

		await expect( blockLibrary ).toBeHidden();

		// Canvas stays zoomed in
		await expect( await InserterUtils.getZoomCanvas() ).toBeHidden();
	} );

	// Same test as above, but starting from zoom out
	test( 'should always exit zoom out from blocks tab and does not change mode when closing the inserter (even if starting from zoom out)', async ( {
		InserterUtils,
	} ) => {
		const zoomOutButton = InserterUtils.getZoomOutButton();
		const inserterButton = InserterUtils.getInserterButton();
		const blockLibrary = InserterUtils.getBlockLibrary();

		await zoomOutButton.click();
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();

		// Open inserter
		await inserterButton.click();
		await expect( blockLibrary ).toBeVisible();

		// Patterns tab should be active
		const patternsTab = InserterUtils.getBlockLibraryTab( 'Patterns' );
		await expect( patternsTab ).toHaveAttribute(
			'data-active-item',
			'true'
		);
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();

		// Click to blocks tab, zooms back in
		const blocksTab = InserterUtils.getBlockLibraryTab( 'Blocks' );
		await blocksTab.click();
		await expect( blocksTab ).toHaveAttribute( 'data-active-item', 'true' );
		await expect( await InserterUtils.getZoomCanvas() ).toBeHidden();

		// Close inserter
		await inserterButton.click();

		await expect( blockLibrary ).toBeHidden();

		// Canvas stays zoomed in
		await expect( await InserterUtils.getZoomCanvas() ).toBeHidden();
	} );

	// Same test as above but exiting from zoom out
	test( 'If we change the zoom level for them via an inserter tab change, always exit zoom out when closing the inserter', async ( {
		InserterUtils,
	} ) => {
		const zoomOutButton = InserterUtils.getZoomOutButton();
		const inserterButton = InserterUtils.getInserterButton();
		const blockLibrary = InserterUtils.getBlockLibrary();

		await zoomOutButton.click();
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();

		await inserterButton.click();
		const patternsTab = InserterUtils.getBlockLibraryTab( 'Patterns' );
		const blocksTab = InserterUtils.getBlockLibraryTab( 'Blocks' );
		const mediaTab = InserterUtils.getBlockLibraryTab( 'Media' );

		// Should start with pattern tab selected in zoom out state
		await expect( patternsTab ).toHaveAttribute(
			'data-active-item',
			'true'
		);
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();

		// Go to blocks tab which should exit zoom out
		// We changed the zoom state for them here, so we "take over" control of the zoom state
		await blocksTab.click();
		await expect( blocksTab ).toHaveAttribute( 'data-active-item', 'true' );
		await expect( await InserterUtils.getZoomCanvas() ).toBeHidden();

		// Go to media tab which should enter zoom out again since that's the starting state
		await mediaTab.click();
		await expect( mediaTab ).toHaveAttribute( 'data-active-item', 'true' );
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();

		// Close the inserter
		await inserterButton.click();
		await expect( blockLibrary ).toBeHidden();

		// We should stay in zoomed out state since we had control over the zoom state and we always exit zoom out when closing the inserter
		await expect( await InserterUtils.getZoomCanvas() ).toBeHidden();
	} );

	test( 'should always exit zoom out if we have most recently changed zoom level for them', async ( {
		InserterUtils,
	} ) => {
		const zoomOutButton = InserterUtils.getZoomOutButton();
		const inserterButton = InserterUtils.getInserterButton();
		const blockLibrary = InserterUtils.getBlockLibrary();

		// Enter zoom out
		await zoomOutButton.click();
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();
		// Open inserter
		await inserterButton.click();
		await expect( blockLibrary ).toBeVisible();

		// Patterns tab should be active
		const patternsTab = InserterUtils.getBlockLibraryTab( 'Patterns' );
		await expect( patternsTab ).toHaveAttribute(
			'data-active-item',
			'true'
		);
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();

		// Click to blocks tab, zooms back in
		const blocksTab = InserterUtils.getBlockLibraryTab( 'Blocks' );
		await blocksTab.click();
		await expect( blocksTab ).toHaveAttribute( 'data-active-item', 'true' );
		await expect( await InserterUtils.getZoomCanvas() ).toBeHidden();

		// Click to media tab, to zoom back out
		const mediaTab = InserterUtils.getBlockLibraryTab( 'Media' );
		await mediaTab.click();
		await expect( mediaTab ).toHaveAttribute( 'data-active-item', 'true' );
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();

		// Close inserter
		await inserterButton.click();

		await expect( blockLibrary ).toBeHidden();

		// We have taken over zoom state control, so we should exit for them.
		await expect( await InserterUtils.getZoomCanvas() ).toBeHidden();
	} );

	// Test for https://github.com/WordPress/gutenberg/issues/66328
	test( 'should not return you to zoom out if manually disengaged', async ( {
		InserterUtils,
	} ) => {
		const zoomOutButton = InserterUtils.getZoomOutButton();
		const inserterButton = InserterUtils.getInserterButton();
		const blockLibrary = InserterUtils.getBlockLibrary();

		await zoomOutButton.click();
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();

		await inserterButton.click();
		await expect( blockLibrary ).toBeVisible();
		const patternsTab = InserterUtils.getBlockLibraryTab( 'Patterns' );
		await expect( patternsTab ).toHaveAttribute(
			'data-active-item',
			'true'
		);
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();

		await zoomOutButton.click();
		await expect( await InserterUtils.getZoomCanvas() ).toBeHidden();

		// Close the inserter
		await inserterButton.click();

		await expect( blockLibrary ).toBeHidden();

		// We should not return to zoom out since it was manually disengaged
		await expect( await InserterUtils.getZoomCanvas() ).toBeHidden();
	} );

	// Similar test to the above but toggle zoom level twice
	test( 'should not toggle zoom state from pattern tab when closing the inserter if the user manually changed zoom state', async ( {
		InserterUtils,
	} ) => {
		const zoomOutButton = InserterUtils.getZoomOutButton();
		const inserterButton = InserterUtils.getInserterButton();
		const blockLibrary = InserterUtils.getBlockLibrary();

		// Open inserter
		await inserterButton.click();
		await expect( blockLibrary ).toBeVisible();

		// Start from blocks stab
		const blocksTab = InserterUtils.getBlockLibraryTab( 'Blocks' );
		await expect( blocksTab ).toHaveAttribute( 'data-active-item', 'true' );
		await expect( await InserterUtils.getZoomCanvas() ).toBeHidden();

		// Go to patterns tab which should enter zoom out
		const patternsTab = InserterUtils.getBlockLibraryTab( 'Patterns' );
		await patternsTab.click();
		await expect( patternsTab ).toHaveAttribute(
			'data-active-item',
			'true'
		);
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();

		// Manually toggle zoom out off
		await zoomOutButton.click();
		await expect( await InserterUtils.getZoomCanvas() ).toBeHidden();

		// Manually toggle zoom out again to return to zoomed-in state set by the patterns tab.
		await zoomOutButton.click();
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();

		// Close the inserter
		await inserterButton.click();

		await expect( blockLibrary ).toBeHidden();

		// We should stay in zoomed out state since it was manually engaged
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();
	} );

	// Similar test to the above but starting from not zoomed in and toggle zoom level twice
	test( 'starting from zoomed in, should not toggle zoom state when closing the inserter if the user manually changed zoom state', async ( {
		InserterUtils,
	} ) => {
		const zoomOutButton = InserterUtils.getZoomOutButton();
		const inserterButton = InserterUtils.getInserterButton();
		const blockLibrary = InserterUtils.getBlockLibrary();

		// Enter zoom out
		await zoomOutButton.click();
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();

		// Open inserter
		await inserterButton.click();
		await expect( blockLibrary ).toBeVisible();

		// Go to patterns tab which should enter zoom out
		const patternsTab = InserterUtils.getBlockLibraryTab( 'Patterns' );
		await patternsTab.click();
		await expect( patternsTab ).toHaveAttribute(
			'data-active-item',
			'true'
		);
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();

		// Manually toggle zoom out off
		await zoomOutButton.click();
		await expect( await InserterUtils.getZoomCanvas() ).toBeHidden();

		// Manually toggle zoom out again to return to zoomed-in state set by the patterns tab.
		await zoomOutButton.click();
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();

		// Close the inserter
		await inserterButton.click();

		await expect( blockLibrary ).toBeHidden();

		// We should stay in zoomed out state since it was manually engaged
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();
	} );

	// Similar to above ones, but doing it from the blocks tab (zoomed out) to zoom in
	test( 'should not return you to zoom out if manually disengaged from blocks tab', async ( {
		InserterUtils,
	} ) => {
		const zoomOutButton = InserterUtils.getZoomOutButton();
		const inserterButton = InserterUtils.getInserterButton();
		const blockLibrary = InserterUtils.getBlockLibrary();

		await inserterButton.click();
		await expect( blockLibrary ).toBeVisible();

		const blocksTab = InserterUtils.getBlockLibraryTab( 'Blocks' );
		await expect( blocksTab ).toHaveAttribute( 'data-active-item', 'true' );
		await expect( await InserterUtils.getZoomCanvas() ).toBeHidden();

		await zoomOutButton.click();
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();

		// Close the inserter
		await inserterButton.click();

		await expect( blockLibrary ).toBeHidden();

		// We should not return to zoom in since it was manually disengaged
		await expect( await InserterUtils.getZoomCanvas() ).toBeVisible();
	} );
} );

class InserterUtils {
	constructor( { editor, page } ) {
		this.editor = editor;
		this.page = page;
	}

	getInserterButton() {
		return this.page.getByRole( 'button', {
			name: 'Block Inserter',
			exact: true,
		} );
	}

	getBlockLibrary() {
		return this.page.getByRole( 'region', {
			name: 'Block Library',
		} );
	}

	getBlockLibraryTab( name ) {
		return this.page.getByRole( 'tab', { name } );
	}

	getZoomOutButton() {
		return this.page.getByRole( 'button', {
			name: 'Zoom Out',
			exact: true,
		} );
	}

	getZoomCanvas() {
		return this.page.locator( '.is-zoomed-out' );
	}
}
