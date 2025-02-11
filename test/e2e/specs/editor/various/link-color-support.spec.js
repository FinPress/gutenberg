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
		pageUtils,
	} ) => {
		await editor.insertBlock( {
			name: 'core/paragraph',
		} );

		await page.keyboard.type(
			'This paragraph will have a custom link color set'
		);

		await page.keyboard.down( 'Shift' );
		for ( let i = 0; i < 21; i++ ) {
			await page.keyboard.press( 'ArrowLeft' );
		}
		await page.keyboard.up( 'Shift' );

		await editor.clickBlockToolbarButton( 'Link' );

		await page.keyboard.type( 'https://example.com' );
		await pageUtils.pressKeys( 'Enter' );

		await expect.poll( editor.getBlocks ).toMatchObject( [
			{
				name: 'core/paragraph',
				attributes: {
					content:
						'This paragraph will have a <a href="https://example.com">custom link color set</a>',
				},
			},
		] );

		const colorOptionsButton = editor.page.locator(
			'[aria-label="Color options"]'
		);
		await colorOptionsButton.click();

		const linkButton = editor.page.locator(
			'button[aria-label="Show Link"]'
		);
		await linkButton.click();

		const linkMenuButton = page.locator(
			'.components-button.block-editor-panel-color-gradient-settings__dropdown',
			{
				hasText: 'Link',
			}
		);
		await linkMenuButton.click();

		const vividCyanBlueButton = editor.page.locator(
			'[aria-label="Vivid cyan blue"]'
		);
		await vividCyanBlueButton.click();

		await pageUtils.pressKeys( 'Escape' );

		const paragraphBlockLinkColor = await editor.getBlocks();

		await expect(
			paragraphBlockLinkColor[ 0 ].attributes.style.elements.link.color
				.text
		).toContain( 'var:preset|color|vivid-cyan-blue' );

		await editor.openPreviewPage();

		const paragraphWithLinkColor = editor.page.locator( '.has-link-color' );
		expect( paragraphWithLinkColor ).not.toBeNull();

		const anchorTag = editor.page.locator( '.has-link-color a' );
		expect( anchorTag ).not.toBeNull();
	} );
} );
