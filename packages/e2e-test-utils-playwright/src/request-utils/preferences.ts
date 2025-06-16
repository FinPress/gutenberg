/**
 * Internal dependencies
 */
import type { RequestUtils } from './index';
import type { RestOptions } from './rest';

/**
 * Reset user preferences
 *
 * @param this        Request utils.
 * @param restOptions Optional REST options to override default settings.
 */
export async function resetPreferences(
	this: RequestUtils,
	restOptions?: Partial< RestOptions >
) {
	await this.rest( {
		...restOptions,
		path: '/wp/v2/users/me',
		method: 'PUT',
		data: {
			meta: {
				persisted_preferences: {},
			},
		},
	} );
}
