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
	if ( ! isCurrentURL( 'fin-login.php' ) && ! isCurrentURL( 'fin-admin' ) ) {
		await page.goto( createURL( 'fin-admin' ) );
	}

	await Promise.all( [
		page.hover( '#fin-admin-bar-my-account' ),
		page.waitForSelector( '#fin-admin-bar-logout', { visible: true } ),
	] );

	await page.click( '#fin-admin-bar-logout' );
}
