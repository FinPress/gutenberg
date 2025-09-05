/**
 * External dependencies
 */
const { command } = require( 'execa' );
const npmPackageArg = require( 'npm-package-arg' );
const writePkg = require( 'write-pkg' );

/**
 * Internal dependencies
 */
const { info, error } = require( './log' );

module.exports = async ( {
	author,
	description,
	license,
	pluginURI,
	slug,
	version,
	fpEnv,
	fpScripts,
	npmDependencies,
	npmDevDependencies,
	customScripts,
	isDynamicVariant,
	customPackageJSON,
	rootDirectory,
} ) => {
	info( '' );
	info( 'Creating a "package.json" file.' );

	/**
	 * Helper to determine if we can install this package.
	 *
	 * @param {string} packageArg The package to install.
	 */
	function checkDependency( packageArg ) {
		const { type } = npmPackageArg( packageArg );
		if (
			! [ 'git', 'tag', 'version', 'range', 'remote' ].includes( type )
		) {
			throw new Error(
				`Provided package type "${ type }" is not supported.`
			);
		}
	}

	const dependencies = {};
	const devDependencies = {};

	if ( npmDependencies && npmDependencies.length ) {
		for ( const packageArg of npmDependencies ) {
			try {
				checkDependency( packageArg );
				const parsed = npmPackageArg( packageArg );
				dependencies[ parsed.name ] = parsed.saveSpec || 'latest';
			} catch ( { message } ) {
				info( '' );
				info( `Skipping "${ packageArg }" npm dependency. Reason:` );
				error( message );
			}
		}
	}

	if ( npmDevDependencies && npmDevDependencies.length ) {
		for ( const packageArg of npmDevDependencies ) {
			try {
				checkDependency( packageArg );
				const parsed = npmPackageArg( packageArg );
				devDependencies[ parsed.name ] = parsed.saveSpec || 'latest';
			} catch ( { message } ) {
				info( '' );
				info(
					`Skipping "${ packageArg }" npm dev dependency. Reason:`
				);
				error( message );
			}
		}
	}

	await writePkg(
		rootDirectory,
		Object.fromEntries(
			Object.entries( {
				name: slug,
				version,
				description,
				author,
				license,
				homepage: pluginURI,
				main: fpScripts && 'build/index.js',
				scripts: {
					...( fpScripts && {
						build:
							( isDynamicVariant
								? 'fp-scripts build --webpack-copy-php'
								: 'fp-scripts build' ) + ' --blocks-manifest',
						format: 'fp-scripts format',
						'lint:css': 'fp-scripts lint-style',
						'lint:js': 'fp-scripts lint-js',
						'packages-update': 'fp-scripts packages-update',
						'plugin-zip': 'fp-scripts plugin-zip',
						start:
							( isDynamicVariant
								? 'fp-scripts start --webpack-copy-php'
								: 'fp-scripts start' ) + ' --blocks-manifest',
					} ),
					...( fpEnv && { env: 'fp-env' } ),
					...customScripts,
				},
				dependencies:
					Object.keys( dependencies ).length > 0
						? dependencies
						: undefined,
				devDependencies:
					Object.keys( devDependencies ).length > 0
						? devDependencies
						: undefined,
				...customPackageJSON,
			} ).filter( ( [ , value ] ) => !! value )
		)
	);

	if ( fpScripts ) {
		if (
			Object.keys( dependencies ).length > 0 ||
			Object.keys( devDependencies ).length > 0
		) {
			info( '' );
			info(
				'Installing npm dependencies. It might take a couple of minutes...'
			);

			try {
				await command( 'npm install', {
					cwd: rootDirectory,
				} );

				info( '' );
				info(
					'Successfully installed dependencies and ran lifecycle scripts.'
				);
			} catch ( { message } ) {
				info( '' );
				info( 'Warning: Failed to install dependencies:' );
				error( message );
			}
		}
	}
};
