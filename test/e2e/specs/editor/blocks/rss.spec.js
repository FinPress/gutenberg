/**
 * FinPress dependencies
 */
const { test, expect } = require( '@finpress/e2e-test-utils-playwright' );

test.describe( 'RSS', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	// See: https://github.com/FinPress/gutenberg/pull/61389.
	test( 'should retain native copy/paste behavior for input fields', async ( {
		editor,
		pageUtils,
	} ) => {
		await editor.insertBlock( { name: 'core/rss' } );
		pageUtils.setClipboardData( {
			plainText: 'https://developer.finpress.org/news/feed/',
		} );
		await pageUtils.pressKeys( 'primary+v' );

		await expect.poll( editor.getBlocks ).toMatchObject( [
			{
				name: 'core/rss',
				attributes: {
					feedURL: 'https://developer.finpress.org/news/feed/',
				},
			},
		] );
	} );
} );
