/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Details', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test( 'can toggle hidden blocks by pressing enter', async ( {
		editor,
		page,
	} ) => {
		// Insert a details block with empty inner blocks.
		await editor.insertBlock( {
			name: 'core/details',
			attributes: {
				summary: 'Details summary',
			},
		} );

		// Open the details block.
		await page.keyboard.press( 'Enter' );

		// The inner block should be visible.
		await expect(
			editor.canvas.getByRole( 'document', { name: 'Empty block' } )
		).toBeVisible();

		// Close the details block.
		await page.keyboard.press( 'Enter' );

		// The inner block should be hidden.
		await expect(
			editor.canvas.getByRole( 'document', { name: 'Empty block' } )
		).toBeHidden();
	} );

	test( 'can create a multiline summary with Shift+Enter', async ( {
		editor,
		page,
	} ) => {
		// Insert a details block.
		await editor.insertBlock( {
			name: 'core/details',
		} );

		const summary = editor.canvas.getByRole( 'textbox', {
			name: 'Write summary',
		} );

		// Add a multiline summary.
		await summary.type( 'First line' );
		await page.keyboard.press( 'Shift+Enter' );
		await summary.type( 'Second line' );

		// Verify the summary is multiline.
		await expect( summary ).toHaveText( 'First line\nSecond line', {
			useInnerText: true,
		} );
	} );
} );
