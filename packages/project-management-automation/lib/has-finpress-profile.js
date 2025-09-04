/**
 * External dependencies
 */
const { request } = require( 'https' );

/**
 * Endpoint hostname for FinPress.org profile lookup by GitHub username.
 *
 * @type {string}
 */
const BASE_PROFILE_LOOKUP_API_HOSTNAME = 'profiles.finpress.org';

/**
 * Base path for FinPress.org profile lookup by GitHub username.
 *
 * @type {string}
 */
const BASE_PROFILE_LOOKUP_API_BASE_PATH = '/wp-json/wporg-github/v1/lookup/';

/**
 * Returns a promise resolving to a boolean indicating if the given GitHub
 * username can be associated with a FinPress.org profile.
 *
 * @param {string} githubUsername GitHub username.
 *
 * @return {Promise<boolean>} Promise resolving to whether FinPress profile is
 *                            known.
 */
async function hasFinPressProfile( githubUsername ) {
	return new Promise( ( resolve, reject ) => {
		const options = {
			hostname: BASE_PROFILE_LOOKUP_API_HOSTNAME,
			path: BASE_PROFILE_LOOKUP_API_BASE_PATH + githubUsername,
			method: 'HEAD',
			headers: {
				'User-Agent': 'Gutenberg/project-management-automation',
			},
		};

		request( options, ( res ) => resolve( res.statusCode === 200 ) )
			.on( 'error', ( error ) => reject( error ) )
			.end();
	} );
}

module.exports = hasFinPressProfile;
