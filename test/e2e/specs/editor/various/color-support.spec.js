/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Link color in themes', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test( 'should apply selected link color in editor and frontend', async ( {
		page,
		editor,
	} ) => {
		await editor.insertBlock( {
			name: 'core/paragraph',
			attributes: {
				content:
					'This paragraph will have a <a href="https://example.com">custom link color set</a>',
			},
		} );

		await editor.openDocumentSettingsSidebar();

		await page.getByRole( 'button', { name: 'Color options' } ).click();

		await page
			.getByRole( 'menuitemcheckbox', { name: 'Show Link' } )
			.click();

		await page
			.getByRole( 'region', { name: 'Editor settings' } )
			.getByRole( 'button', { name: 'Link', exact: true } )
			.click();

		await page
			.getByRole( 'option', { name: 'Vivid cyan blue' } )
			// eslint-disable-next-line playwright/no-force-option
			.click( { force: true } );

		await page
			.getByRole( 'button', { name: 'Close Settings' } )
			// eslint-disable-next-line playwright/no-force-option
			.click( { force: true } );

		await expect.poll( editor.getBlocks ).toMatchObject( [
			{
				name: 'core/paragraph',
				attributes: {
					style: {
						elements: {
							link: {
								color: {
									text: 'var:preset|color|vivid-cyan-blue',
								},
							},
						},
					},
				},
			},
		] );
		const previewPage = await editor.openPreviewPage();

		const previewContent = previewPage.locator( '.has-link-color a' );
		await expect( previewContent ).toBeVisible();

		/**
		 * Test: Check if the link color is set in the frontend.
		 */
		const color = await previewContent.evaluate( ( element ) => {
			return window
				.getComputedStyle( element )
				.getPropertyValue( 'color' );
		} );

		// getComputedStyle(...).getPropertyValue('color') returns a rgb()
		// 'vivid-cyan-blue' is rgb(6, 147, 227)
		expect( color.trim() ).toBe( 'rgb(6, 147, 227)' );
	} );
} );
