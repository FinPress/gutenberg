/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Block Hooks API', () => {
	const anchorBlockMarkup = `<!-- wp:paragraph -->
<p>This is a test paragraph.</p>
<!-- /wp:paragraph -->`;

	const getHookedBlockMarkup = (
		relativePosition,
		anchorBlock
	) => `<!-- wp:paragraph {"backgroundColor":"accent"} -->
<p class="has-background has-accent-background-color">
This block was inserted by the Block Hooks API in the <code>${ relativePosition }</code> position next to the <code>${ anchorBlock }</code> anchor block.
</p><!-- /wp:paragraph -->`;

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

	test( 'should convert to a preformatted block', async ( {
		admin,
		editor,
	} ) => {
		await admin.editPost( post.id );
		await expect
			.poll( editor.getEditedPostContent )
			.toBe(
				anchorBlockMarkup +
					getHookedBlockMarkup( 'last_child', 'core/post-content' )
			);
	} );
} );
