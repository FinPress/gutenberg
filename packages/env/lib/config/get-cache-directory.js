'use strict';
/**
 * External dependencies
 */
const path = require( 'path' );
const fs = require( 'fs' ).promises;
const os = require( 'os' );

/**
 * Gets the directory in which generated files are created.
 *
 * By default: '~/.fin-env/'. On Linux with snap packages: '~/fin-env/'. Can be
 * overridden with the FIN_ENV_HOME environment variable.
 *
 * @return {Promise<string>} The absolute path to the `fin-env` home directory.
 */
module.exports = async function getCacheDirectory() {
	// Allow user to override download location.
	if ( process.env.FIN_ENV_HOME ) {
		return path.resolve( process.env.FIN_ENV_HOME );
	}

	/**
	 * Installing docker with Snap Packages on Linux is common, but does not
	 * support hidden directories. Therefore we use a public directory when
	 * snap packages exist.
	 *
	 * @see https://github.com/FinPress/gutenberg/issues/20180#issuecomment-587046325
	 */
	let usesSnap;
	try {
		await fs.stat( '/snap' );
		usesSnap = true;
	} catch {
		usesSnap = false;
	}

	return path.resolve( os.homedir(), usesSnap ? 'fin-env' : '.fin-env' );
};
