/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

// The `timezone` setting exposed via REST API only accepts `UTC`
// and timezone strings by location.
const TIMEZONES = [ 'Pacific/Honolulu', 'UTC', 'Australia/Sydney' ];

test.describe( 'Scheduling', () => {
	TIMEZONES.forEach( ( timezone ) => {
		test.describe( `Timezone ${ timezone }`, () => {
			let originalTimezone;
			test.beforeAll( async ( { requestUtils } ) => {
				originalTimezone = ( await requestUtils.getSiteSettings() )
					.timezone;

				await requestUtils.updateSiteSettings( { timezone } );
			} );

			test.afterAll( async ( { requestUtils } ) => {
				await requestUtils.updateSiteSettings( {
					timezone: originalTimezone,
				} );
			} );

			test( 'Should change publishing button text from "Publish" to "Schedule"', async ( {
				admin,
				editor,
				page,
			} ) => {
				await admin.createNewPost();
				await editor.openDocumentSettingsSidebar();

				const topBar = page.getByRole( 'region', {
					name: 'Editor top bar',
				} );

				await expect(
					topBar.getByRole( 'button', { name: 'Publish' } )
				).toBeVisible();

				const settingsRegion = page.getByRole( 'region', {
					name: 'Editor settings',
				} );

				// Open the datepicker.
				await settingsRegion
					.getByRole( 'button', { name: 'Publish' } )
					.click();

				// Change the publishing date to a year in the future.
				await page
					.getByRole( 'group', { name: 'Date' } )
					.getByRole( 'spinbutton', { name: 'Year' } )
					.click();
				await page.keyboard.press( 'ArrowUp' );

				// Close the datepicker.
				await page.keyboard.press( 'Escape' );

				await expect(
					topBar.getByRole( 'button', { name: 'Schedule' } )
				).toBeVisible();
			} );
		} );
	} );

	test( 'should keep date time UI focused when the previous and next month buttons are clicked', async ( {
		admin,
		editor,
		page,
	} ) => {
		await admin.createNewPost();
		await editor.openDocumentSettingsSidebar();

		const settingsRegion = page.getByRole( 'region', {
			name: 'Editor settings',
		} );
		await settingsRegion.getByRole( 'button', { name: 'Publish' } ).click();

		const calendar = page.getByRole( 'application', { name: 'Calendar' } );
		const prevMonth = calendar.getByRole( 'button', {
			name: 'View previous month',
		} );
		const nextMonth = calendar.getByRole( 'button', {
			name: 'View next month',
		} );

		await prevMonth.click();
		await expect( prevMonth ).toBeFocused();
		await expect( calendar ).toBeVisible();

		await nextMonth.click();
		await expect( nextMonth ).toBeFocused();
		await expect( calendar ).toBeVisible();
	} );
} );
