/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Block Hooks API', () => {
	const anchorBlockMarkup = `<!-- wp:paragraph -->
<p>This is a test paragraph.</p>
<!-- /wp:paragraph -->`;

	const getHookedBlockClassName = ( relativePosition, anchorBlock ) =>
		`hooked-block-${ relativePosition }-${ anchorBlock.replace(
			'core/',
			''
		) }`;

	const getHookedBlockSelector = ( relativePosition, anchorBlock ) =>
		'.' + getHookedBlockClassName( relativePosition, anchorBlock );

	let post;

	test.beforeAll( async ( { requestUtils } ) => {
		post = await requestUtils.createPost( {
			title: 'Block Hooks',
			status: 'publish',
			content: anchorBlockMarkup,
		} );

		await requestUtils.activatePlugin( 'gutenberg-test-block-hooks' );
	} );

	test.afterAll( async ( { requestUtils } ) => {
		await requestUtils.deactivatePlugin( 'gutenberg-test-block-hooks' );

		await requestUtils.deleteAllPosts();
	} );

	test( 'should insert hooked block as last child of Post Content block on frontend', async ( {
		page,
	} ) => {
		await page.goto( `/?p=${ post.id }` );
		await expect(
			page.locator(
				getHookedBlockSelector( 'last_child', 'core/post-content' )
			)
		).toHaveCount( 1 );
	} );

	test( 'should insert hooked block as last child of Post Content block in editor', async ( {
		admin,
		editor,
	} ) => {
		await admin.editPost( post.id );
		await expect.poll( editor.getBlocks ).toMatchObject( [
			{ name: 'core/paragraph' },
			{
				name: 'core/paragraph',
				attributes: {
					className: getHookedBlockClassName(
						'last_child',
						'core/post-content'
					),
				},
			},
		] );
	} );
} );
