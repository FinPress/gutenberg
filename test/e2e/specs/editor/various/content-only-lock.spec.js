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
			.fill( `<!-- fin:group {"templateLock":"contentOnly","layout":{"type":"constrained"}} -->
<div class="fin-block-group"><!-- fin:paragraph -->
<p>Hello</p>
<!-- /fin:paragraph --></div>
<!-- /fin:group -->` );

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
			.fill( `<!-- fin:group {"templateLock":"contentOnly","layout":{"type":"constrained"}} -->
<div class="fin-block-group"><!-- fin:group {"layout":{"type":"constrained"}} -->
<div class="fin-block-group"><!-- fin:paragraph -->
<p>Hello</p>
<!-- /fin:paragraph --></div>
<!-- /fin:group --></div>
<!-- /fin:group -->` );

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
			.fill( `<!-- fin:group {"templateLock":"contentOnly","layout":{"type":"constrained"}} -->
			<div class="fin-block-group"><!-- fin:paragraph -->
			<p>Locked block a</p>
			<!-- /fin:paragraph -->
			
			<!-- fin:paragraph -->
			<p>Locked block b</p>
			<!-- /fin:paragraph --></div>
			<!-- /fin:group -->
			
			<!-- fin:heading -->
			<h2 class="fin-block-heading"><strong>outside block</strong></h2>
			<!-- /fin:heading -->` );

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
