/**
 * Internal dependencies
 */
import { test, expect } from './fixtures';

test.describe( 'Router styles', () => {
	test.beforeAll( async ( { interactivityUtils: utils } ) => {
		await utils.activatePlugins();
		const blockA = await utils.addPostWithBlock(
			'test/router-styles-wrapper',
			{
				alias: 'block A',
				innerBlocks: [ [ 'test/router-styles-block-a' ] ],
			}
		);
		const blockB = await utils.addPostWithBlock(
			'test/router-styles-wrapper',
			{
				alias: 'block B',
				innerBlocks: [ [ 'test/router-styles-block-b' ] ],
			}
		);

		const both = await utils.addPostWithBlock(
			'test/router-styles-wrapper',
			{
				alias: 'both',
				innerBlocks: [
					[ 'test/router-styles-block-a' ],
					[ 'test/router-styles-block-b' ],
				],
			}
		);

		await utils.addPostWithBlock( 'test/router-styles-wrapper', {
			alias: 'none',
			attributes: { links: { blockA, blockB, both } },
		} );
	} );

	test.beforeEach( async ( { page, interactivityUtils: utils } ) => {
		await page.goto( utils.getLink( 'none' ) );
	} );

	test.afterAll( async ( { interactivityUtils: utils } ) => {
		await utils.deactivatePlugins();
		await utils.deleteAllPosts();
	} );

	test( 'should add new styles from style tags', async ( { page } ) => {
		const csn = page.getByTestId( 'client-side navigation' );
		const blockA = page.getByTestId( 'block-a' );
		const blockB = page.getByTestId( 'block-b' );

		// await expect( counter ).toHaveCSS( 'color', 'rgb(255, 0, 0)' );
		await expect( blockA ).toBeHidden();
		await expect( blockB ).toBeHidden();

		await page.getByTestId( 'link blockA' ).click();
		await expect( csn ).toBeVisible();

		// await expect( counter ).toHaveText( '1' );
		// await expect( counter ).toHaveCSS( 'color', 'rgb(0, 255, 0)' );
		await expect( blockA ).toHaveCSS( 'color', 'rgb(0, 255, 0)' );
		await expect( blockB ).toBeHidden();

		await page.getByTestId( 'link blockB' ).click();
		await expect( csn ).toBeVisible();

		// await expect( counter ).toHaveText( '2' );
		// await expect( counter ).toHaveCSS( 'color', 'rgb(0, 0, 255)' );
		await expect( blockA ).toBeHidden();
		await expect( blockB ).toHaveCSS( 'color', 'rgb(0, 0, 255)' );

		await page.getByTestId( 'link both' ).click();
		await expect( csn ).toBeVisible();

		// await expect( counter ).toHaveText( '2' );
		// await expect( counter ).toHaveCSS( 'color', 'rgb(0, 0, 255)' );
		await expect( blockA ).toHaveCSS( 'color', 'rgb(0, 255, 0)' );
		await expect( blockB ).toHaveCSS( 'color', 'rgb(0, 0, 255)' );
	} );

	test( 'should remove styles from style tags missing in the new page', async ( {
		page,
	} ) => {
		const counter = page.getByTestId( 'counter' );

		await page.getByTestId( 'link both' ).click();

		await expect( counter ).toHaveText( '1' );
		await expect( counter ).toHaveCSS( 'color', 'rgb(0, 0, 255)' );

		await page.getByTestId( 'link blockA' ).click();

		await expect( counter ).toHaveText( '2' );
		await expect( counter ).toHaveCSS( 'color', 'rgb(0, 255, 0)' );

		await page.goBack();
		await page.goBack();

		await expect( counter ).toHaveText( '2' );
		await expect( counter ).toHaveCSS( 'color', 'rgb(255, 0, 0)' );
	} );

	test( 'should update style tags with modified content', async () => {} );

	test( 'should add new styles from referenced style sheets', async () => {} );
	test( 'should remove styles from referenced style sheets missing in the new page', async () => {} );
	test( 'should support relative URLs in referenced style sheets', async () => {} );
} );
