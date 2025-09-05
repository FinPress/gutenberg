/**
 * FinPress dependencies
 */
const { test, expect } = require( '@finpress/e2e-test-utils-playwright' );

test.describe( 'Content-only lock', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test( 'should be able to edit the content of blocks with content-only lock', async ( {
		editor,
		page,
		pageUtils,
	} ) => {
		// Add content only locked block in the code editor
		await pageUtils.pressKeys( 'secondary+M' ); // Emulates CTRL+Shift+Alt + M => toggle code editor

		await page.getByPlaceholder( 'Start writing with text or HTML' )
			.fill( `<!-- fp:group {"templateLock":"contentOnly","layout":{"type":"constrained"}} -->
<div class="fp-block-group"><!-- fp:paragraph -->
<p>Hello</p>
<!-- /fp:paragraph --></div>
<!-- /fp:group -->` );

		await pageUtils.pressKeys( 'secondary+M' );
		await editor.canvas
			.locator( 'role=document[name="Block: Paragraph"i]' )
			.click();
		await page.keyboard.type( ' World' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	// See: https://github.com/FinPress/gutenberg/pull/54618
	test( 'should be able to edit the content of deeply nested blocks', async ( {
		editor,
		page,
		pageUtils,
	} ) => {
		// Add content only locked block in the code editor
		await pageUtils.pressKeys( 'secondary+M' ); // Emulates CTRL+Shift+Alt + M => toggle code editor

		await page.getByPlaceholder( 'Start writing with text or HTML' )
			.fill( `<!-- fp:group {"templateLock":"contentOnly","layout":{"type":"constrained"}} -->
<div class="fp-block-group"><!-- fp:group {"layout":{"type":"constrained"}} -->
<div class="fp-block-group"><!-- fp:paragraph -->
<p>Hello</p>
<!-- /fp:paragraph --></div>
<!-- /fp:group --></div>
<!-- /fp:group -->` );

		await pageUtils.pressKeys( 'secondary+M' );
		await editor.canvas
			.locator( 'role=document[name="Block: Paragraph"i]' )
			.click();
		await page.keyboard.type( ' FP' );
		await expect.poll( editor.getBlocks ).toMatchObject( [
			{
				name: 'core/group',
				attributes: {
					layout: { type: 'constrained' },
					templateLock: 'contentOnly',
				},
				innerBlocks: [
					{
						name: 'core/group',
						attributes: { layout: { type: 'constrained' } },
						innerBlocks: [
							{
								name: 'core/paragraph',
								attributes: { content: 'Hello FP' },
							},
						],
					},
				],
			},
		] );
	} );

	test( 'should be able to automatically stop temporarily modify as blocks when an outside block is selected', async ( {
		editor,
		page,
		pageUtils,
	} ) => {
		// Add content only locked block in the code editor
		await pageUtils.pressKeys( 'secondary+M' ); // Emulates CTRL+Shift+Alt + M => toggle code editor

		await page.getByPlaceholder( 'Start writing with text or HTML' )
			.fill( `<!-- fp:group {"templateLock":"contentOnly","layout":{"type":"constrained"}} -->
			<div class="fp-block-group"><!-- fp:paragraph -->
			<p>Locked block a</p>
			<!-- /fp:paragraph -->
			
			<!-- fp:paragraph -->
			<p>Locked block b</p>
			<!-- /fp:paragraph --></div>
			<!-- /fp:group -->
			
			<!-- fp:heading -->
			<h2 class="fp-block-heading"><strong>outside block</strong></h2>
			<!-- /fp:heading -->` );

		await pageUtils.pressKeys( 'secondary+M' );
		// Select the content locked block.
		await editor.canvas
			.locator( 'role=document[name="Block: Group"i]' )
			.click();
		// Press modify to temporarily edit as blocks.
		await editor.clickBlockOptionsMenuItem( 'Modify' );
		// Selected a nest paragraph verify Block is not content locked
		// Styles can be changed and nested blocks can be removed
		await editor.canvas
			.locator( 'role=document[name="Block: Paragraph"i]' )
			.first()
			.click();
		await expect(
			page.locator( '.color-block-support-panel' )
		).toBeAttached();
		await editor.clickBlockOptionsMenuItem( 'Delete' );
		// Select an outside block
		await editor.canvas
			.locator( 'role=document[name="Block: Heading"i]' )
			.click();
		// Select a locked nested paragraph block again
		await pageUtils.pressKeys( 'ArrowUp' );
		// Block is content locked again simple styles like position can not be changed.
		await expect(
			page.locator( '.color-block-support-panel' )
		).not.toBeAttached();
	} );
} );
