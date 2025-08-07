/**
 * External dependencies
 */
const { command } = require( 'execa' );
const fs = require( 'fs' );
const path = require( 'path' );

/**
 * Internal dependencies
 */
const { info } = require( './log' );

module.exports = async ( { rootDirectory } ) => {
	const packageJsonPath = path.join( rootDirectory, 'package.json' );
	let scripts = {};

	if ( fs.existsSync( packageJsonPath ) ) {
		try {
			const packageJson = JSON.parse(
				fs.readFileSync( packageJsonPath, 'utf8' )
			);
			scripts = packageJson.scripts || {};
		} catch ( error ) {
			info( `Warning: Could not parse package.json: ${ error.message }` );
		}
	}

	// Execute preinstall script if it exists.
	if ( scripts.preinstall ) {
		info( '' );
		info( 'Executing preinstall script...' );
		try {
			await command( 'npm run preinstall', { cwd: rootDirectory } );
			info( 'Successfully executed preinstall' );
		} catch ( error ) {
			info( `Warning: Failed to execute preinstall: ${ error.message }` );
		}
	}

	info( '' );
	info(
		'Installing `@wordpress/scripts` package. It might take a couple of minutes...'
	);
	await command( 'npm install @wordpress/scripts --save-dev', {
		cwd: rootDirectory,
	} );

	// Execute postinstall script if it exists.
	if ( scripts.postinstall ) {
		info( '' );
		info( 'Executing postinstall script...' );
		try {
			await command( 'npm run postinstall', { cwd: rootDirectory } );
			info( 'Successfully executed postinstall' );
		} catch ( error ) {
			info(
				`Warning: Failed to execute postinstall: ${ error.message }`
			);
		}
	}

	info( '' );
	info( 'Formatting JavaScript files.' );
	await command( 'npm run format', {
		cwd: rootDirectory,
	} );

	info( '' );
	info( 'Compiling block and generating blocks manifest.' );
	await command( 'npm run build', {
		cwd: rootDirectory,
	} );
};
