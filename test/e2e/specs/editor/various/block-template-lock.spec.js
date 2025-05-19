/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Template Lock', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.deleteAllPosts();
	} );

	const createColumnsBlockWithLock = ( templateLock ) => ( {
		name: 'core/columns',
		attributes: { templateLock },
		innerBlocks: [
			{
				name: 'core/column',
				innerBlocks: [
					{
						name: 'core/paragraph',
						attributes: { content: 'Col 1' },
					},
				],
			},
			{
				name: 'core/column',
				innerBlocks: [
					{
						name: 'core/paragraph',
						attributes: { content: 'Col 2' },
					},
				],
			},
		],
	} );

	test.describe( 'templateLock="all"', () => {
		test.beforeEach( async ( { editor } ) => {
			await editor.insertBlock( createColumnsBlockWithLock( 'all' ) );

			await editor.selectBlocks(
				editor.canvas.getByLabel( 'Block: Column (1 of 2)' )
			);
		} );

		test( 'should prevent deleting columns', async ( { editor, page } ) => {
			await editor.clickBlockToolbarButton( 'Options' );
			await expect(
				page
					.getByRole( 'menu', { name: 'Options' } )
					.getByRole( 'menuitem', { name: 'Delete' } )
			).toBeHidden();
		} );

		test( 'should prevent moving columns', async ( { page } ) => {
			await expect(
				page
					.getByRole( 'toolbar', { name: 'Block tools' } )
					.getByRole( 'button', { name: 'Move down' } )
			).toBeHidden();
		} );

		test( 'should prevent inserting blocks inside columns', async ( {
			editor,
		} ) => {
			await expect(
				editor.canvas.getByLabel( 'Add Block' )
			).toBeHidden();
		} );
	} );

	test.describe( 'templateLock="insert"', () => {
		test.beforeEach( async ( { editor } ) => {
			await editor.insertBlock( createColumnsBlockWithLock( 'insert' ) );

			await editor.selectBlocks(
				editor.canvas.getByLabel( 'Block: Column (1 of 2)' )
			);
		} );

		test( 'should prevent deleting columns', async ( { editor, page } ) => {
			await editor.clickBlockToolbarButton( 'Options' );
			await expect(
				page
					.getByRole( 'menu', { name: 'Options' } )
					.getByRole( 'menuitem', { name: 'Delete' } )
			).toBeHidden();
		} );

		test( 'should allow moving columns', async ( { page } ) => {
			await expect(
				page
					.getByRole( 'toolbar', { name: 'Block tools' } )
					.getByRole( 'button', { name: 'Move right' } )
			).toBeVisible();
		} );

		test( 'should prevent inserting blocks inside columns', async ( {
			editor,
		} ) => {
			await expect(
				editor.canvas.getByLabel( 'Add Block' )
			).toBeHidden();
		} );
	} );

	test.describe( 'templateLock="contentOnly"', () => {
		test.beforeEach( async ( { editor } ) => {
			await editor.insertBlock(
				createColumnsBlockWithLock( 'contentOnly' )
			);

			await editor.selectBlocks(
				editor.canvas.getByLabel( 'Block: Column (1 of 2)' )
			);
		} );

		// test( 'should prevent deleting columns', async ( { editor, page } ) => {
		// 	await editor.clickBlockToolbarButton( 'Options' );
		// 	await expect(
		// 		page
		// 			.getByRole( 'menu', { name: 'Options' } )
		// 			.getByRole( 'menuitem', { name: 'Delete' } )
		// 	).toBeHidden();
		// } );

		test( 'should prevent moving columns', async ( { page } ) => {
			await expect(
				page
					.getByRole( 'toolbar', { name: 'Block tools' } )
					.getByRole( 'button', { name: 'Move down' } )
			).toBeHidden();
		} );

		test( 'should prevent inserting blocks inside columns', async ( {
			editor,
		} ) => {
			await expect(
				editor.canvas.getByLabel( 'Add Block' )
			).toBeHidden();
		} );

		test( 'should allow editing content inside columns', async ( {
			editor,
			page,
		} ) => {
			const paragraphLocator = editor.canvas.getByText( 'Col 1' );
			await editor.selectBlocks( paragraphLocator );

			await page.keyboard.type( 'Edited - ' );
			await expect( paragraphLocator ).toHaveText( 'Edited - Col 1' );
		} );
	} );
} );
