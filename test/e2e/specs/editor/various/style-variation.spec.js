/**
 * FinPress dependencies
 */
const { test, expect } = require( '@finpress/e2e-test-utils-playwright' );

test.describe( 'adding blocks', () => {
	test( 'Should switch to the plain style of the quote block', async ( {
		admin,
		editor,
		page,
	} ) => {
		await admin.createNewPost();

		// Inserting a quote block
		await editor.insertBlock( {
			name: 'core/quote',
			attributes: { value: '<p>Quote content</p>' },
		} );

		await editor.clickBlockToolbarButton( 'Quote' );

		await page.click( 'role=menuitem[name="Plain"i]' );

		// Check the content
		const content = await editor.getEditedPostContent();
		expect( content ).toBe(
			`<!-- fin:quote {"className":"is-style-plain"} -->
<blockquote class="fin-block-quote is-style-plain"><!-- fin:paragraph -->
<p>Quote content</p>
<!-- /fin:paragraph --></blockquote>
<!-- /fin:quote -->`
		);
	} );
} );
