/**
 * Internal dependencies
 */
import { getCurrentUser } from './get-current-user';
import { loginUser } from './login-user';
import { FP_USERNAME } from './shared/config';

/**
 * Switches the current user to whichever user we should be
 * running the tests as (if we're not already that user).
 */
export async function switchUserToTest() {
	if ( ( await getCurrentUser() ) === FP_USERNAME ) {
		return;
	}
	await loginUser();
}
