/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

const anchorBlockMarkup = `<!-- wp:heading -->
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
	test.describe( 'Hooked blocks in Post Content', () => {
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

		test( 'should insert hooked blocks into post content on frontend', async ( {
			page,
		} ) => {
			await page.goto( `/?p=${ post.id }` );
			await expect( page.locator( '.entry-content > *' ) ).toHaveClass( [
				'wp-block-heading',
				getHookedBlockClassName( 'after', 'core/heading' ),
				'dummy-paragraph',
				getHookedBlockClassName( 'last_child', 'core/post-content' ),
			] );
		} );

		test( 'should insert hooked blocks into post content in editor and respect changes made there', async ( {
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
						'core/post-content'
					),
				},
			};

			await admin.editPost( post.id );
			await expect
				.poll( editor.getBlocks )
				.toMatchObject( [
					{ name: 'core/heading' },
					expectedHookedBlockAfterHeading,
					{ name: 'core/paragraph' },
					expectedHookedBlockLastChild,
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
					{ name: 'core/heading' },
					expectedHookedBlockAfterHeading,
					expectedHookedBlockLastChild,
					{ name: 'core/paragraph' },
				] );

			// Verify that the frontend reflects the changes made in the editor.
			await page.goto( `/?p=${ post.id }` );
			await expect( page.locator( '.entry-content > *' ) ).toHaveClass( [
				'wp-block-heading',
				getHookedBlockClassName( 'after', 'core/heading' ),
				getHookedBlockClassName( 'last_child', 'core/post-content' ),
				'dummy-paragraph',
			] );
		} );
	} );

	test.describe( 'Hooked blocks in Synced Patterns', () => {
		let post, syncedPattern;
		test.beforeAll( async ( { requestUtils } ) => {
			syncedPattern = await requestUtils.createBlock( {
				title: 'Synced Pattern',
				status: 'publish',
				content: anchorBlockMarkup,
			} );

			await requestUtils.activatePlugin( 'gutenberg-test-block-hooks' );

			post = await requestUtils.createPost( {
				title: 'Block Hooks in Synced Patterns',
				status: 'publish',
				content: `<!-- wp:block {"ref":${ syncedPattern.id }} /-->`,
				meta: {
					// Prevent Block Hooks from injecting blocks into
					// post content so they won't distract from the ones
					// injected into the synced pattern.
					_wp_ignored_hooked_blocks: '["core/paragraph"]',
				},
			} );
		} );

		test.afterAll( async ( { requestUtils } ) => {
			await requestUtils.deactivatePlugin( 'gutenberg-test-block-hooks' );

			await requestUtils.deleteAllPosts();
			await requestUtils.deleteAllBlocks();
		} );

		test( 'should insert hooked blocks into synced pattern on frontend', async ( {
			page,
		} ) => {
			await page.goto( `/?p=${ post.id }` );
			await expect( page.locator( '.entry-content > *' ) ).toHaveClass( [
				'wp-block-heading',
				getHookedBlockClassName( 'after', 'core/heading' ),
				'dummy-paragraph',
				getHookedBlockClassName( 'last_child', 'core/block' ),
			] );
		} );

		test( 'should insert hooked blocks into synced pattern in editor and respect changes made there', async ( {
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
						'core/block'
					),
				},
			};

			await admin.editPost( syncedPattern.id );
			await expect
				.poll( editor.getBlocks )
				.toMatchObject( [
					{ name: 'core/heading' },
					expectedHookedBlockAfterHeading,
					{ name: 'core/paragraph' },
					expectedHookedBlockLastChild,
				] );

			const hookedBlock = editor.canvas.getByText(
				getHookedBlockContent( 'last_child', 'core/block' )
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
			await page.goto( `/?p=${ post.id }` );
			await expect( page.locator( '.entry-content > *' ) ).toHaveClass( [
				'wp-block-heading',
				getHookedBlockClassName( 'after', 'core/heading' ),
				getHookedBlockClassName( 'last_child', 'core/block' ),
				'dummy-paragraph',
			] );
		} );
	} );
} );
