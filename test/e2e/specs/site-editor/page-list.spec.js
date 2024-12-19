/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );
/**
 * External dependencies
 */
const path = require( 'path' );

test.describe( 'Page List', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		// Activate a theme with permissions to access the site editor.
		await requestUtils.activateTheme( 'emptytheme' );
		await requestUtils.createPage( {
			title: 'Privacy Policy',
			status: 'publish',
		} );
		await requestUtils.createPage( {
			title: 'Sample Page',
			status: 'publish',
		} );
	} );

	test.afterAll( async ( { requestUtils } ) => {
		// Go back to the default theme.
		await Promise.all( [
			requestUtils.activateTheme( 'twentytwentyone' ),
			requestUtils.deleteAllPages(),
		] );
	} );

	test.beforeEach( async ( { admin, page } ) => {
		// Go to the pages page, as it has the list layout enabled by default.
		await admin.visitSiteEditor();
		await page.getByRole( 'button', { name: 'Pages' } ).click();
	} );

	test( 'Persists filter/search when switching layout', async ( {
		page,
	} ) => {
		// Search pages
		await page
			.getByRole( 'searchbox', { name: 'Search' } )
			.fill( 'Privacy' );

		// Switch layout
		await page.getByRole( 'button', { name: 'Layout' } ).click();
		await page.getByRole( 'menuitemradio', { name: 'Table' } ).click();

		// Confirm the table is visible
		await expect( page.getByRole( 'table' ) ).toContainText(
			'Privacy Policy'
		);

		// The search should still contain the search term
		await expect(
			page.getByRole( 'searchbox', { name: 'Search' } )
		).toHaveValue( 'Privacy' );
	} );

	test.describe( 'Quick Edit Mode', () => {
		const fields = {
			'featured-image': {
				edit: async ( page ) => {
					const placeholder = page.getByRole( 'button', {
						name: 'Choose an image…',
					} );
					await placeholder.click();
					const mediaLibrary = page.getByRole( 'dialog' );
					const TEST_IMAGE_FILE_PATH = path.resolve(
						__dirname,
						'../../assets/10x10_e2e_test_image_z9T8jK.png'
					);

					const fileChooserPromise =
						page.waitForEvent( 'filechooser' );
					await mediaLibrary.getByText( 'Select files' ).click();
					const fileChooser = await fileChooserPromise;
					await fileChooser.setFiles( TEST_IMAGE_FILE_PATH );
					await mediaLibrary
						.locator( '.media-frame-toolbar' )
						.waitFor( {
							state: 'hidden',
						} );

					await mediaLibrary
						.getByRole( 'button', { name: 'Select', exact: true } )
						.click();
				},
				initialView: async ( page ) => {
					const el = page.getByText( 'Choose an image…' );
					const placeholder = page.getByRole( 'button', {
						name: 'Choose an image…',
					} );
					await expect( el ).toBeVisible();
					await expect( placeholder ).toBeVisible();
				},
				viewAfterEdit: async ( page ) => {
					const placeholder = page.getByRole( 'button', {
						name: 'Choose an image…',
					} );
					await expect( placeholder ).toBeHidden();
					const img = page.locator(
						'.fields-controls__featured-image-image'
					);
					await expect( img ).toBeVisible();
				},
			},
			'status-visibility': {
				edit: async ( page ) => {
					const statusAndVisibility = page.getByLabel(
						'Status & Visibility'
					);
					await statusAndVisibility.click();
					const options = [
						'Published',
						'Draft',
						'Pending Review',
						'Private',
					];

					for ( const option of options ) {
						await page
							.getByRole( 'radio', { name: option } )
							.click();
						await expect( statusAndVisibility ).toContainText(
							option
						);

						if ( option !== 'Private' ) {
							await page
								.getByRole( 'checkbox', {
									name: 'Password protected',
								} )
								.check();
						}
					}
				},
				initialView: async ( page ) => {
					const statusAndVisibility = page.getByLabel(
						'Status & Visibility'
					);
					await expect( statusAndVisibility ).toContainText(
						'Published'
					);
				},
				viewAfterEdit: async ( page ) => {
					const statusAndVisibility = page.getByLabel(
						'Status & Visibility'
					);
					await expect( statusAndVisibility ).toContainText(
						'Private'
					);
				},
			},
			author: {
				initialView: async ( page ) => {
					const author = page.getByLabel( 'Author' );
					await expect( author ).toContainText( 'admin' );
				},
				edit: async ( page ) => {
					const author = page.getByLabel( 'Author' );
					await author.click();
					const selectElement = page.locator(
						'select:has(option[value="1"])'
					);
					await selectElement.selectOption( { value: '1' } );
				},
				viewAfterEdit: async () => {},
			},
			date: {
				initialView: async ( page ) => {
					const dateEl = page.getByLabel( 'Edit Date' );
					const date = new Date();
					const yy = String( date.getFullYear() );

					await expect( dateEl ).toContainText( yy );
				},
				edit: async ( page ) => {
					const dateEl = page.getByLabel( 'Edit Date' );
					await dateEl.click();
					const date = new Date();
					const yy = Number( date.getFullYear() );
					const yyEl = page.locator(
						`input[type="number"][value="${ yy }"]`
					);

					await yyEl.focus();
					await page.keyboard.press( 'ArrowUp' );
				},
				viewAfterEdit: async ( page ) => {
					const date = new Date();
					const yy = Number( date.getFullYear() );
					const dateEl = page.getByLabel( 'Edit Date' );
					await expect( dateEl ).toContainText( String( yy + 1 ) );
				},
			},
			slug: {
				initialView: async ( page ) => {
					const slug = page.getByLabel( 'Edit Slug' );
					await expect( slug ).toContainText( 'privacy-policy' );
				},
				edit: async ( page ) => {
					const slug = page.getByLabel( 'Edit Slug' );
					await slug.click();
					await expect(
						page.getByRole( 'link', {
							name: 'http://localhost:8889/?',
						} )
					).toBeVisible();
				},
				viewAfterEdit: async () => {},
			},
			parent: {
				initialView: async ( page ) => {
					const parent = page.getByLabel( 'Edit Parent' );
					await expect( parent ).toContainText( 'None' );
				},
				edit: async ( page ) => {
					const parent = page.getByLabel( 'Edit Parent' );
					await parent.click();
					await page
						.getByLabel( 'Parent', { exact: true } )
						.fill( 'Sample' );

					await page
						.getByRole( 'option', { name: 'Sample Page' } )
						.click();
				},
				viewAfterEdit: async ( page ) => {
					const parent = page.getByLabel( 'Edit Parent' );
					await expect( parent ).toContainText( 'Sample Page' );
				},
			},
			// template: {
			// 	initialView: async ( page ) => {
			// 		const template = page.getByRole( 'button', {
			// 			name: 'Single Entries',
			// 		} );
			// 		await expect( template ).toContainText( 'Single Entries' );
			// 	},
			// 	edit: async ( page ) => {
			// 		const template = page.getByRole( 'button', {
			// 			name: 'Single Entries',
			// 		} );
			// 		await template.click();
			// 		await page
			// 			.getByRole( 'menuitem', { name: 'Swap template' } )
			// 			.click();
			// 	},
			// 	viewAfterEdit: async ( page ) => {
			// 		await page.waitForTimeout( 15000 );
			// 	},
			// },
			discussion: {
				initialView: async ( page ) => {
					const discussion = page.getByLabel( 'Edit Discussion' );
					await expect( discussion ).toContainText( 'Closed' );
				},
				edit: async ( page ) => {
					const discussion = page.getByLabel( 'Edit Discussion' );
					await discussion.click();
					await page
						.getByLabel( 'Open', {
							exact: true,
						} )
						.check();
				},
				viewAfterEdit: async ( page ) => {
					const discussion = page.getByLabel( 'Edit Discussion' );
					await expect( discussion ).toContainText( 'Open' );
				},
			},
		};

		test.beforeAll( async ( { requestUtils } ) => {
			await requestUtils.setGutenbergExperiments( [
				'gutenberg-quick-edit-dataviews',
			] );
		} );

		test.beforeEach( async ( { admin, page } ) => {
			await admin.visitSiteEditor();
			await page.getByRole( 'button', { name: 'Pages' } ).click();
			await page.getByRole( 'button', { name: 'Layout' } ).click();
			await page.getByRole( 'menuitemradio', { name: 'Table' } ).click();
			const privacyPolicyCheckbox = page.getByRole( 'checkbox', {
				name: 'Select Item: Privacy Policy',
			} );

			await privacyPolicyCheckbox.check();

			await page.getByRole( 'button', { name: 'Details' } ).click();
		} );

		Object.entries( fields ).forEach(
			( [ key, { edit, initialView, viewAfterEdit } ] ) => {
				// Asserts are done in the individual functions
				// eslint-disable-next-line playwright/expect-expect
				test( key, async ( { page } ) => {
					await initialView( page );
					await edit( page );
					await viewAfterEdit( page );
				} );
			}
		);

		test.afterAll( async ( { requestUtils } ) => {
			await requestUtils.setGutenbergExperiments( [] );
		} );
	} );
} );
