/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

const dummyBlockContent = `<!-- wp:heading -->
<h2 class="wp-block-heading">This is a dummy heading</h2>
<!-- /wp:heading -->
<!-- wp:paragraph {"className":"dummy-paragraph"} -->
<p class="dummy-paragraph">This is a dummy paragraph.</p>
<!-- /wp:paragraph -->`;

const getHookedBlockClassName = ( relativePosition, anchorBlock ) =>
	`hooked-block-${ relativePosition }-${ anchorBlock.replace(
		'core/',
		''
	) }`;

const getHookedBlockContent = ( relativePosition, anchorBlock ) =>
	`This block was inserted by the Block Hooks API in the ${ relativePosition } position next to the ${ anchorBlock } anchor block.`;

test.describe( 'Block Hooks API', () => {
	[
		{
			name: 'Post Content',
			postType: 'post',
			blockType: 'core/post-content',
			createMethod: 'createPost',
		},
		{
			name: 'Synced Pattern',
			postType: 'wp_block',
			blockType: 'core/block',
			createMethod: 'createBlock',
		},
	].forEach( ( { name, postType, blockType, createMethod } ) => {
		test.describe( `Hooked blocks in ${ name }`, () => {
			let postObject, containerPost;
			test.beforeAll( async ( { requestUtils } ) => {
				postObject = await requestUtils[ createMethod ]( {
					title: name,
					status: 'publish',
					content: dummyBlockContent,
				} );

				await requestUtils.activatePlugin(
					'gutenberg-test-block-hooks'
				);

				if ( postType !== 'post' ) {
					// We need a container post to hold our block instance.
					containerPost = await requestUtils.createPost( {
						title: `Block Hooks in ${ name }`,
						status: 'publish',
						content: `<!-- wp:${ blockType } {"ref":${ postObject.id }} /-->`,
						meta: {
							// Prevent Block Hooks from injecting blocks into the container
							// post content so they won't distract from the ones injected
							// into the block instance.
							_wp_ignored_hooked_blocks: '["core/paragraph"]',
						},
					} );
				} else {
					containerPost = postObject;
				}
			} );

			test.afterAll( async ( { requestUtils } ) => {
				await requestUtils.deactivatePlugin(
					'gutenberg-test-block-hooks'
				);

				await requestUtils.deleteAllPosts();
				await requestUtils.deleteAllBlocks();
			} );

			test( `should insert hooked blocks into ${ name } on frontend`, async ( {
				page,
			} ) => {
				await page.goto( `/?p=${ containerPost.id }` );
				await expect(
					page.locator( '.entry-content > *' )
				).toHaveClass( [
					'wp-block-heading',
					getHookedBlockClassName( 'after', 'core/heading' ),
					'dummy-paragraph',
					getHookedBlockClassName( 'last_child', blockType ),
				] );
			} );

			test( `should insert hooked blocks into ${ name } in editor and respect changes made there`, async ( {
				admin,
				editor,
				page,
			} ) => {
				const expectedHookedBlockAfterHeading = {
					name: 'core/paragraph',
					attributes: {
						className: getHookedBlockClassName(
							'after',
							'core/heading'
						),
					},
				};

				const expectedHookedBlockLastChild = {
					name: 'core/paragraph',
					attributes: {
						className: getHookedBlockClassName(
							'last_child',
							blockType
						),
					},
				};

				await admin.editPost( postObject.id );
				await expect
					.poll( editor.getBlocks )
					.toMatchObject( [
						{ name: 'core/heading' },
						expectedHookedBlockAfterHeading,
						{ name: 'core/paragraph' },
						expectedHookedBlockLastChild,
					] );

				const hookedBlock = editor.canvas.getByText(
					getHookedBlockContent( 'last_child', blockType )
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
						{ name: 'core/heading' },
						expectedHookedBlockAfterHeading,
						expectedHookedBlockLastChild,
						{ name: 'core/paragraph' },
					] );

				// Verify that the frontend reflects the changes made in the editor.
				await page.goto( `/?p=${ containerPost.id }` );
				await expect(
					page.locator( '.entry-content > *' )
				).toHaveClass( [
					'wp-block-heading',
					getHookedBlockClassName( 'after', 'core/heading' ),
					getHookedBlockClassName( 'last_child', blockType ),
					'dummy-paragraph',
				] );
			} );
		} );
	} );
} );
