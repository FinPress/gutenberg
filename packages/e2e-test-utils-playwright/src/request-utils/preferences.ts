/**
 * Internal dependencies
 */
import type { RequestUtils } from './index';

/**
 * Reset user preferences
 *
 * @param this Request utils.
 */
export async function resetPreferences( this: RequestUtils ) {
	await this.rest( {
		path: '/fp/v2/users/me',
		method: 'PUT',
		data: {
			meta: {
				persisted_preferences: {},
			},
		},
	} );
}
