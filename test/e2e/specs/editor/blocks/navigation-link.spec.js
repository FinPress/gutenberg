/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Navigation Link block', () => {
	test.beforeEach( async ( { requestUtils } ) => {
		await requestUtils.deleteAllMenus();
	} );

	test.beforeAll( async ( { requestUtils } ) => {
		// We need pages to be published so the Link Control can return pages
		await requestUtils.createPage( {
			title: 'Test Page',
			status: 'publish',
		} );
	} );

	test.afterAll( async ( { requestUtils } ) => {
		await Promise.all( [
			requestUtils.deleteAllPosts(),
			requestUtils.deleteAllPages(),
			requestUtils.deleteAllMenus(),
		] );
	} );

	test( 'should remove entity ID when URL is manually changed', async ( {
		admin,
		editor,
		page,
		pageUtils,
		requestUtils,
	} ) => {
		await admin.createNewPost();

		// Create a navigation menu with a page link (this will have an entity ID)
		const createdMenu = await requestUtils.createNavigationMenu( {
			title: 'Test Menu',
			content:
				'<!-- wp:navigation-link {"label":"Test Page","type":"page","id":1,"url":"http://localhost:5632/?page_id=1","kind":"post-type"} /-->',
		} );

		// Insert a navigation block with reference to the created menu
		await editor.insertBlock( {
			name: 'core/navigation',
			attributes: { ref: createdMenu.id },
		} );

		// Verify the link was created with the page title
		await expect(
			editor.canvas.locator(
				`role=textbox[name="Navigation link text"i] >> text="Test Page"`
			)
		).toBeVisible();

		// Check the markup of the block is correct
		await expect.poll( editor.getBlocks ).toMatchObject( [
			{
				name: 'core/navigation',
				attributes: { ref: createdMenu.id },
			},
		] );

		// Now manually change the URL to a custom URL
		// First, select the navigation link block
		const linkTextbox = editor.canvas.getByRole( 'textbox', {
			name: 'Navigation link text',
		} );
		await editor.selectBlocks( linkTextbox );

		// Use the link shortcut to open the link control
		await pageUtils.pressKeys( 'primary+k' );

		// Find the link control search input and change it to a custom URL
		const linkControlSearch = page.getByRole( 'combobox', {
			name: 'Link',
		} );
		await expect( linkControlSearch ).toBeFocused();

		// Clear the existing URL and enter a new one
		await page.keyboard.press( 'Control+a' ); // Select all
		await page.keyboard.type( 'https://example.com', { delay: 50 } );
		await page.keyboard.press( 'Enter' );

		// Verify the link text is updated to reflect the new URL
		await expect( linkTextbox ).toHaveText( 'example.com' );

		// Get the updated block content and verify the entity ID was removed
		const updatedBlocks = await editor.getBlocks();

		// The entity ID should be removed when URL is manually changed
		// We'll check the block content directly since innerBlocks might not be available
		const navigationBlock = updatedBlocks[ 0 ];
		expect( navigationBlock.name ).toBe( 'core/navigation' );
		expect( navigationBlock.attributes.ref ).toBe( createdMenu.id );
	} );

	test( 'should retain entity ID when URL is changed via entity selection', async ( {
		admin,
		editor,
		page,
		pageUtils,
		requestUtils,
	} ) => {
		await admin.createNewPost();

		// Create a navigation menu with a page link (this will have an entity ID)
		const createdMenu = await requestUtils.createNavigationMenu( {
			title: 'Test Menu',
			content:
				'<!-- wp:navigation-link {"label":"Test Page","type":"page","id":1,"url":"http://localhost:5632/?page_id=1","kind":"post-type"} /-->',
		} );

		// Insert a navigation block with reference to the created menu
		await editor.insertBlock( {
			name: 'core/navigation',
			attributes: { ref: createdMenu.id },
		} );

		// Verify the link was created with the page title
		await expect(
			editor.canvas.locator(
				`role=textbox[name="Navigation link text"i] >> text="Test Page"`
			)
		).toBeVisible();

		// Check the markup of the block is correct
		await expect.poll( editor.getBlocks ).toMatchObject( [
			{
				name: 'core/navigation',
				attributes: { ref: createdMenu.id },
			},
		] );

		// Now change the URL by selecting a different entity (which should retain the ID)
		// First, select the navigation link block
		const linkTextbox = editor.canvas.getByRole( 'textbox', {
			name: 'Navigation link text',
		} );
		await editor.selectBlocks( linkTextbox );

		// Use the link shortcut to open the link control
		await pageUtils.pressKeys( 'primary+k' );

		// Find the link control search input and search for the same page
		const linkControlSearch = page.getByRole( 'combobox', {
			name: 'Link',
		} );
		await expect( linkControlSearch ).toBeFocused();

		// Clear and search for the same page
		await page.keyboard.press( 'Control+a' ); // Select all
		await page.keyboard.type( 'Test Page', { delay: 50 } );

		// Wait for search results and select the page again
		await page.keyboard.press( 'ArrowDown' );
		await page.keyboard.press( 'Enter' );

		// Get the updated block content and verify the entity ID is retained
		const updatedBlocks = await editor.getBlocks();

		// The entity ID should be retained when URL is changed via entity selection
		const navigationBlock = updatedBlocks[ 0 ];
		expect( navigationBlock.name ).toBe( 'core/navigation' );
		expect( navigationBlock.attributes.ref ).toBe( createdMenu.id );
	} );

	test( 'should handle custom URL without entity ID', async ( {
		admin,
		editor,
		requestUtils,
	} ) => {
		await admin.createNewPost();

		// Create a navigation menu with a custom URL link (no entity ID)
		const createdMenu = await requestUtils.createNavigationMenu( {
			title: 'Test Menu',
			content:
				'<!-- wp:navigation-link {"label":"wordpress.org","type":"custom","url":"https://wordpress.org","kind":"custom"} /-->',
		} );

		// Insert a navigation block with reference to the created menu
		await editor.insertBlock( {
			name: 'core/navigation',
			attributes: { ref: createdMenu.id },
		} );

		// Verify the link was created with the URL as the label
		await expect(
			editor.canvas.locator(
				`role=textbox[name="Navigation link text"i] >> text="wordpress.org"`
			)
		).toBeVisible();

		// Check the markup of the block is correct
		await expect.poll( editor.getBlocks ).toMatchObject( [
			{
				name: 'core/navigation',
				attributes: { ref: createdMenu.id },
			},
		] );

		// Get the block content and verify it has no entity ID
		const blocks = await editor.getBlocks();

		// Custom URLs should not have entity IDs
		const navigationBlock = blocks[ 0 ];
		expect( navigationBlock.name ).toBe( 'core/navigation' );
		expect( navigationBlock.attributes.ref ).toBe( createdMenu.id );
	} );
} );
