/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Block Hooks API', () => {
	const anchorBlockMarkup = `<!-- wp:paragraph {"className":"test-paragraph"} -->
<p class="test-paragraph">This is a test paragraph.</p>
<!-- /wp:paragraph -->`;

	const getHookedBlockClassName = ( relativePosition, anchorBlock ) =>
		`hooked-block-${ relativePosition }-${ anchorBlock.replace(
			'core/',
			''
		) }`;

	const getHookedBlockSelector = ( relativePosition, anchorBlock ) =>
		'.' + getHookedBlockClassName( relativePosition, anchorBlock );

	const getHookedBlockContent = ( relativePosition, anchorBlock ) =>
		`This block was inserted by the Block Hooks API in the ${ relativePosition } position next to the ${ anchorBlock } anchor block.`;

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
		// Verify that the hook block is inserted after the test paragraph.
		await expect( page.locator( '.entry-content p' ) ).toHaveClass( [
			'test-paragraph',
			getHookedBlockClassName( 'last_child', 'core/post-content' ),
		] );
	} );

	test( 'should insert hooked block as last child of Post Content block in editor', async ( {
		admin,
		editor,
		page,
	} ) => {
		const expectedHookedBlock = {
			name: 'core/paragraph',
			attributes: {
				className: getHookedBlockClassName(
					'last_child',
					'core/post-content'
				),
			},
		};

		await admin.editPost( post.id );
		await expect
			.poll( editor.getBlocks )
			.toMatchObject( [
				{ name: 'core/paragraph' },
				expectedHookedBlock,
			] );

		const hookedBlock = editor.canvas.getByText(
			getHookedBlockContent( 'last_child', 'core/post-content' )
		);
		await editor.selectBlocks( hookedBlock );
		await editor.clickBlockToolbarButton( 'Move up' );

		// Save updated post.
		const saveButton = page
			.getByRole( 'region', { name: 'Editor top bar' } )
			.getByRole( 'button', { name: 'Save', exact: true } );
		await saveButton.click();
		await page
			.getByRole( 'button', { name: 'Dismiss this notice' } )
			.filter( { hasText: 'updated' } )
			.waitFor();

		// Reload and verify that the new position of the hooked block has been persisted.
		await page.reload();
		await expect
			.poll( editor.getBlocks )
			.toMatchObject( [
				expectedHookedBlock,
				{ name: 'core/paragraph' },
			] );

		// Verify that the frontend reflects the changes made in the editor.
		await page.goto( `/?p=${ post.id }` );
		await expect(
			page.locator(
				getHookedBlockSelector( 'last_child', 'core/post-content' )
			)
		).toHaveCount( 1 );
		// Verify that the hooked block is now before the test paragraph.
		await expect( page.locator( '.entry-content p' ) ).toHaveClass( [
			getHookedBlockClassName( 'last_child', 'core/post-content' ),
			'test-paragraph',
		] );
	} );
} );
