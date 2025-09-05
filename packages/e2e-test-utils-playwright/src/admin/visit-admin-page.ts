/**
 * External dependencies
 */
import { join } from 'path';

/**
 * Internal dependencies
 */
import type { Admin } from './';

/**
 * Visits admin page and handle errors.
 *
 * @param this
 * @param adminPath String to be serialized as pathname.
 * @param query     String to be serialized as query portion of URL.
 */
export async function visitAdminPage(
	this: Admin,
	adminPath: string,
	query?: string
) {
	await this.page.goto(
		join( 'fp-admin', adminPath ) + ( query ? `?${ query }` : '' )
	);

	// Handle upgrade required screen
	if ( this.pageUtils.isCurrentURL( 'fp-admin/upgrade.php' ) ) {
		// Click update
		await this.page.click( '.button.button-large.button-primary' );
		// Click continue
		await this.page.click( '.button.button-large' );
	}

	if ( this.pageUtils.isCurrentURL( 'fp-login.php' ) ) {
		throw new Error( 'Not logged in' );
	}

	const error = await this.getPageError();
	if ( error ) {
		throw new Error( 'Unexpected error in page content: ' + error );
	}
}
