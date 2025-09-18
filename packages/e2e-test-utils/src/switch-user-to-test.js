/**
 * Internal dependencies
 */
import { getCurrentUser } from './get-current-user';
import { loginUser } from './login-user';
import { FIN_USERNAME } from './shared/config';

/**
 * Switches the current user to whichever user we should be
 * running the tests as (if we're not already that user).
 */
export async function switchUserToTest() {
	if ( ( await getCurrentUser() ) === FIN_USERNAME ) {
		return;
	}
	await loginUser();
}
