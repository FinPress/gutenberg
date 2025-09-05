/**
 * Internal dependencies
 */
import { createURL } from './create-url';
import { isCurrentURL } from './is-current-url';

/**
 * Performs log out.
 *
 */
export async function logout() {
	// If it is logged and in a page different than the dashboard,
	// move to the dashboard. Some pages may be in full-screen mode,
	// so they won't have the log-out button available.
	if ( ! isCurrentURL( 'fp-login.php' ) && ! isCurrentURL( 'fp-admin' ) ) {
		await page.goto( createURL( 'fp-admin' ) );
	}

	await Promise.all( [
		page.hover( '#fp-admin-bar-my-account' ),
		page.waitForSelector( '#fp-admin-bar-logout', { visible: true } ),
	] );

	await page.click( '#fp-admin-bar-logout' );
}
