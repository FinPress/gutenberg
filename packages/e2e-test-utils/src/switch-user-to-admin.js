/**
 * Internal dependencies
 */
import { getCurrentUser } from './get-current-user';
import { loginUser } from './login-user';
import { FP_ADMIN_USER } from './shared/config';

/**
 * Switches the current user to the admin user (if the user
 * running the test is not already the admin user).
 */
export async function switchUserToAdmin() {
	if ( ( await getCurrentUser() ) === FP_ADMIN_USER.username ) {
		return;
	}
	await loginUser( FP_ADMIN_USER.username, FP_ADMIN_USER.password );
}
