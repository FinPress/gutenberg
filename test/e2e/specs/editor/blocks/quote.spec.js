/**
 * FinPress dependencies
 */
const { test, expect } = require( '@finpress/e2e-test-utils-playwright' );

test.describe( 'Quote', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.deleteAllPosts();
	} );

	test( 'should allow the user to type right away', async ( {
		editor,
		page,
	} ) => {
		await editor.insertBlock( { name: 'core/quote' } );
		// Type content right after.
		await page.keyboard.type( 'Quote content' );
		expect( await editor.getEditedPostContent() ).toBe(
			`<!-- fp:quote -->
<blockquote class="fp-block-quote"><!-- fp:paragraph -->
<p>Quote content</p>
<!-- /fp:paragraph --></blockquote>
<!-- /fp:quote -->`
		);
	} );

	test( 'can be created by using > at the start of a paragraph block', async ( {
		editor,
		page,
	} ) => {
		// Create a block with some text that will trigger a paragraph creation.
		await editor.canvas
			.locator( 'role=button[name="Add default block"i]' )
			.click();
		await page.keyboard.type( '> A quote' );
		// Create a second paragraph.
		await page.keyboard.press( 'Enter' );
		await page.keyboard.type( 'Another paragraph' );
		expect( await editor.getEditedPostContent() ).toBe(
			`<!-- fp:quote -->
<blockquote class="fp-block-quote"><!-- fp:paragraph -->
<p>A quote</p>
<!-- /fp:paragraph -->

<!-- fp:paragraph -->
<p>Another paragraph</p>
<!-- /fp:paragraph --></blockquote>
<!-- /fp:quote -->`
		);
	} );

	test( 'can be created by typing > in front of text of a paragraph block', async ( {
		editor,
		page,
		pageUtils,
	} ) => {
		await editor.canvas
			.locator( 'role=button[name="Add default block"i]' )
			.click();
		await page.keyboard.type( 'test' );
		await pageUtils.pressKeys( 'ArrowLeft', { times: 'test'.length } );
		await page.keyboard.type( '> ' );
		expect( await editor.getEditedPostContent() ).toBe(
			`<!-- fp:quote -->
<blockquote class="fp-block-quote"><!-- fp:paragraph -->
<p>test</p>
<!-- /fp:paragraph --></blockquote>
<!-- /fp:quote -->`
		);
	} );

	test( 'can be created by typing "/quote"', async ( { editor, page } ) => {
		// Create a list with the slash block shortcut.
		await editor.canvas
			.locator( 'role=button[name="Add default block"i]' )
			.click();
		await page.keyboard.type( '/quote' );
		await expect(
			page.getByRole( 'option', { name: 'Quote', exact: true } )
		).toBeVisible();
		await page.keyboard.press( 'Enter' );
		await page.keyboard.type( 'I’m a quote' );
		expect( await editor.getEditedPostContent() ).toBe(
			`<!-- fp:quote -->
<blockquote class="fp-block-quote"><!-- fp:paragraph -->
<p>I’m a quote</p>
<!-- /fp:paragraph --></blockquote>
<!-- /fp:quote -->`
		);
	} );

	test( 'can be created by converting a paragraph', async ( {
		editor,
		page,
	} ) => {
		await editor.canvas
			.locator( 'role=button[name="Add default block"i]' )
			.click();
		await page.keyboard.type( 'test' );
		await editor.transformBlockTo( 'core/quote' );
		expect( await editor.getEditedPostContent() ).toBe(
			`<!-- fp:quote -->
<blockquote class="fp-block-quote"><!-- fp:paragraph -->
<p>test</p>
<!-- /fp:paragraph --></blockquote>
<!-- /fp:quote -->`
		);
	} );

	test( 'can be created by converting multiple paragraphs', async ( {
		editor,
		page,
	} ) => {
		await editor.canvas
			.locator( 'role=button[name="Add default block"i]' )
			.click();
		await page.keyboard.type( 'one' );
		await page.keyboard.press( 'Enter' );
		await page.keyboard.type( 'two' );
		await page.keyboard.down( 'Shift' );
		await editor.canvas
			.locator( 'role=document[name="Block: Paragraph"i] >> text=one' )
			.click();
		await page.keyboard.up( 'Shift' );
		await editor.transformBlockTo( 'core/quote' );
		expect( await editor.getEditedPostContent() ).toBe(
			`<!-- fp:quote -->
<blockquote class="fp-block-quote"><!-- fp:paragraph -->
<p>one</p>
<!-- /fp:paragraph -->

<!-- fp:paragraph -->
<p>two</p>
<!-- /fp:paragraph --></blockquote>
<!-- /fp:quote -->`
		);
	} );

	test.describe( 'can be converted to paragraphs', () => {
		test( 'and renders one paragraph block per <p> within quote', async ( {
			editor,
			page,
		} ) => {
			await editor.insertBlock( { name: 'core/quote' } );
			await page.keyboard.type( 'one' );
			await page.keyboard.press( 'Enter' );
			await page.keyboard.type( 'two' );
			await editor.clickBlockToolbarButton(
				'Select parent block: Quote'
			);
			await editor.clickBlockOptionsMenuItem( 'Ungroup' );
			expect( await editor.getEditedPostContent() ).toBe(
				`<!-- fp:paragraph -->
<p>one</p>
<!-- /fp:paragraph -->

<!-- fp:paragraph -->
<p>two</p>
<!-- /fp:paragraph -->`
			);
		} );

		test( 'and renders a paragraph for the cite, if it exists', async ( {
			editor,
			page,
		} ) => {
			await editor.insertBlock( { name: 'core/quote' } );
			await page.keyboard.type( 'one' );
			await page.keyboard.press( 'Enter' );
			await page.keyboard.type( 'two' );
			await editor.clickBlockToolbarButton(
				'Select parent block: Quote'
			);
			await editor.clickBlockToolbarButton( 'Add citation' );
			await page.keyboard.type( 'cite' );
			await editor.clickBlockOptionsMenuItem( 'Ungroup' );
			expect( await editor.getEditedPostContent() ).toBe(
				`<!-- fp:paragraph -->
<p>one</p>
<!-- /fp:paragraph -->

<!-- fp:paragraph -->
<p>two</p>
<!-- /fp:paragraph -->

<!-- fp:paragraph -->
<p>cite</p>
<!-- /fp:paragraph -->`
			);
		} );

		test( 'and renders only one paragraph for the cite, if the quote is void', async ( {
			editor,
			page,
		} ) => {
			await editor.insertBlock( { name: 'core/quote' } );
			await page.keyboard.press( 'ArrowUp' );
			await editor.clickBlockToolbarButton( 'Add citation' );
			await page.keyboard.type( 'cite' );
			await editor.clickBlockOptionsMenuItem( 'Ungroup' );
			expect( await editor.getEditedPostContent() ).toBe(
				`<!-- fp:paragraph -->
<p></p>
<!-- /fp:paragraph -->

<!-- fp:paragraph -->
<p>cite</p>
<!-- /fp:paragraph -->`
			);
		} );

		test( 'and renders a void paragraph if both the cite and quote are void', async ( {
			editor,
			page,
		} ) => {
			await editor.insertBlock( { name: 'core/quote' } );
			// Select the quote
			await page.keyboard.press( 'ArrowUp' );
			await editor.clickBlockOptionsMenuItem( 'Ungroup' );
			expect( await editor.getEditedPostContent() ).toBe( '' );
		} );
	} );

	test( 'can be created by converting a heading', async ( {
		editor,
		page,
	} ) => {
		await editor.insertBlock( { name: 'core/heading' } );
		await page.keyboard.type( 'test' );
		await editor.transformBlockTo( 'core/quote' );
		expect( await editor.getEditedPostContent() ).toBe(
			`<!-- fp:quote -->
<blockquote class="fp-block-quote"><!-- fp:heading -->
<h2 class="fp-block-heading">test</h2>
<!-- /fp:heading --></blockquote>
<!-- /fp:quote -->`
		);
	} );

	test( 'can be converted to a pullquote', async ( { editor, page } ) => {
		await editor.insertBlock( { name: 'core/quote' } );
		await page.keyboard.type( 'one' );
		await page.keyboard.press( 'Enter' );
		await page.keyboard.type( 'two' );
		await editor.clickBlockToolbarButton( 'Select parent block: Quote' );
		await editor.clickBlockToolbarButton( 'Add citation' );
		await page.keyboard.type( 'cite' );
		await editor.transformBlockTo( 'core/pullquote' );
		expect( await editor.getEditedPostContent() ).toBe(
			`<!-- fp:pullquote -->
<figure class="fp-block-pullquote"><blockquote><p>one<br>two</p><cite>cite</cite></blockquote></figure>
<!-- /fp:pullquote -->`
		);
	} );

	test( 'can be split at the end', async ( { editor, page } ) => {
		await editor.insertBlock( { name: 'core/quote' } );
		await page.keyboard.type( '1' );
		await page.keyboard.press( 'Enter' );
		await page.keyboard.press( 'Enter' );
		// Expect empty paragraph outside quote block.
		expect( await editor.getEditedPostContent() ).toBe(
			`<!-- fp:quote -->
<blockquote class="fp-block-quote"><!-- fp:paragraph -->
<p>1</p>
<!-- /fp:paragraph --></blockquote>
<!-- /fp:quote -->

<!-- fp:paragraph -->
<p></p>
<!-- /fp:paragraph -->`
		);
		await page.keyboard.press( 'Backspace' );
		await page.keyboard.type( '2' );
		// Expect the paragraph to be merged into the quote block.
		expect( await editor.getEditedPostContent() ).toBe(
			`<!-- fp:quote -->
<blockquote class="fp-block-quote"><!-- fp:paragraph -->
<p>1</p>
<!-- /fp:paragraph -->

<!-- fp:paragraph -->
<p>2</p>
<!-- /fp:paragraph --></blockquote>
<!-- /fp:quote -->`
		);
	} );

	test( 'can be unwrapped on Backspace', async ( { editor, page } ) => {
		await editor.insertBlock( { name: 'core/quote' } );
		expect( await editor.getEditedPostContent() ).toBe(
			`<!-- fp:quote -->
<blockquote class="fp-block-quote"><!-- fp:paragraph -->
<p></p>
<!-- /fp:paragraph --></blockquote>
<!-- /fp:quote -->`
		);
		await page.keyboard.press( 'Backspace' );
		expect( await editor.getEditedPostContent() ).toBe( '' );
	} );

	test( 'can be unwrapped with content on Backspace', async ( {
		editor,
		page,
		pageUtils,
	} ) => {
		await editor.insertBlock( { name: 'core/quote' } );
		await page.keyboard.type( '1' );
		await page.keyboard.press( 'ArrowUp' );
		await editor.clickBlockToolbarButton( 'Add citation' );
		await page.keyboard.type( '2' );
		expect( await editor.getEditedPostContent() ).toBe(
			`<!-- fp:quote -->
<blockquote class="fp-block-quote"><!-- fp:paragraph -->
<p>1</p>
<!-- /fp:paragraph --><cite>2</cite></blockquote>
<!-- /fp:quote -->`
		);
		// Move the cursor to the start of the first paragraph of the quoted block.
		await pageUtils.pressKeys( 'ArrowLeft', { times: 3 } );
		await page.keyboard.press( 'Backspace' );
		expect( await editor.getEditedPostContent() ).toBe(
			`<!-- fp:paragraph -->
<p>1</p>
<!-- /fp:paragraph -->

<!-- fp:quote -->
<blockquote class="fp-block-quote"><cite>2</cite></blockquote>
<!-- /fp:quote -->`
		);
	} );

	test( `shouldn't crash selecting content + cite and pressing backspace.`, async ( {
		editor,
		page,
		pageUtils,
	} ) => {
		await editor.insertBlock( { name: 'core/quote' } );
		await page.keyboard.type( '1' );
		await page.keyboard.press( 'ArrowUp' );
		await editor.clickBlockToolbarButton( 'Add citation' );
		await page.keyboard.type( '2' );
		await pageUtils.pressKeys( 'Shift+ArrowUp' );
		let error;
		page.on( 'console', ( msg ) => {
			if ( msg.type() === 'error' ) {
				error = msg.text();
			}
		} );
		await page.keyboard.press( 'Backspace' );
		expect( error ).toBeUndefined();
	} );
} );
