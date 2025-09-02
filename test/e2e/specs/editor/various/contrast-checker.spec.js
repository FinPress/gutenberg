/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

const WARNING_TEXT = 'This color combination may be hard for people to read';

test.describe( 'ContrastChecker', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test( 'should show warning for insufficient contrast', async ( {
		editor,
		page,
	} ) => {
		await editor.openDocumentSettingsSidebar();

		const lowContrastWarning = page.locator(
			'.block-editor-contrast-checker'
		);

		await test.step( 'Check black text on black background', async () => {
			await editor.insertBlock( {
				name: 'core/paragraph',
				attributes: { content: 'Black text on Black background' },
			} );

			await page
				.getByRole( 'button', { name: 'Text', exact: true } )
				.click();
			await page.getByRole( 'option', { name: 'Black' } ).click();
			await page.getByRole( 'button', { name: 'Background' } ).click();
			await page.getByRole( 'option', { name: 'Black' } ).click();

			await expect( lowContrastWarning ).toBeVisible();
			await expect( lowContrastWarning ).toContainText( WARNING_TEXT );
		} );

		await test.step( 'Check white text on default background', async () => {
			await editor.insertBlock( {
				name: 'core/paragraph',
				attributes: { content: 'White text on Default background' },
			} );

			await page
				.getByRole( 'button', { name: 'Text', exact: true } )
				.click();
			await page.getByRole( 'option', { name: 'White' } ).click();

			await expect( lowContrastWarning ).toBeVisible();
			await expect( lowContrastWarning ).toContainText( WARNING_TEXT );
		} );
	} );

	test( 'should not show warning for sufficient contrast', async ( {
		editor,
		page,
	} ) => {
		await editor.openDocumentSettingsSidebar();

		const lowContrastWarning = page.locator(
			'.block-editor-contrast-checker'
		);

		await editor.insertBlock( {
			name: 'core/paragraph',
			attributes: { content: 'Black text on White background' },
		} );

		await page.getByRole( 'button', { name: 'Text', exact: true } ).click();
		await page.getByRole( 'option', { name: 'Black' } ).click();
		await page.getByRole( 'button', { name: 'Background' } ).click();
		await page.getByRole( 'option', { name: 'White' } ).click();

		await expect( lowContrastWarning ).not.toBeVisible();
	} );
} );
