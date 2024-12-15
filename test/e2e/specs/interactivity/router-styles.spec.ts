/**
 * Internal dependencies
 */
import { test, expect } from './fixtures';

test.describe( 'Router styles', () => {
	test.beforeAll( async ( { interactivityUtils: utils } ) => {
		await utils.activatePlugins();
		const blockA = await utils.addPostWithBlock(
			'test/router-styles-region-block',
			{
				alias: 'block A',
				innerBlocks: [ [ 'test/router-styles-block-a' ] ],
			}
		);
		const blockB = await utils.addPostWithBlock(
			'test/router-styles-region-block',
			{
				alias: 'block B',
				innerBlocks: [ [ 'test/router-styles-block-b' ] ],
			}
		);

		const both = await utils.addPostWithBlock(
			'test/router-styles-region-block',
			{
				alias: 'both',
				innerBlocks: [
					[ 'test/router-styles-block-a' ],
					[ 'test/router-styles-block-b' ],
				],
			}
		);

		await utils.addPostWithBlock( 'test/router-styles-region-block', {
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
		const counter = page.getByTestId( 'counter' );
		await expect( counter ).toHaveText( '0' );
		await expect( counter ).toHaveCSS( 'color', 'rgb(255, 0, 0)' );
	} );
} );
