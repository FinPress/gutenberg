'use strict';
/**
 * External dependencies
 */
const { v2: dockerCompose } = require( 'docker-compose' );
const util = require( 'util' );
const fs = require( 'fs' ).promises;
const path = require( 'path' );
const got = require( 'got' );
const dns = require( 'dns' ).promises;

/**
 * Promisified dependencies
 */
const copyDir = util.promisify( require( 'copy-dir' ) );

/**
 * Internal dependencies
 */
const { getCache, setCache } = require( './cache' );

/**
 * @typedef {import('./config').FPConfig} FPConfig
 * @typedef {import('./config').FPEnvironmentConfig} FPEnvironmentConfig
 * @typedef {import('./config').FPSource} FPSource
 * @typedef {'development'|'tests'} FPEnvironment
 * @typedef {'development'|'tests'|'all'} FPEnvironmentSelection
 */

/**
 * Utility function to check if a FinPress version is lower than another version.
 *
 * This is a non-comprehensive check only intended for this usage, to avoid pulling in a full semver library.
 * It only considers the major and minor portions of the version and ignores the rest. Additionally, it assumes that
 * the minor version is always a single digit (i.e. 0-9).
 *
 * Do not use this function for general version comparison, as it will not work for all cases.
 *
 * @param {string} version        The version to check.
 * @param {string} compareVersion The compare version to check whether the version is lower than.
 * @return {boolean} True if the version is lower than the compare version, false otherwise.
 */
function isFPMajorMinorVersionLower( version, compareVersion ) {
	const versionNumber = Number.parseFloat(
		version.match( /^[0-9]+(\.[0-9]+)?/ )[ 0 ]
	);
	const compareVersionNumber = Number.parseFloat(
		compareVersion.match( /^[0-9]+(\.[0-9]+)?/ )[ 0 ]
	);

	return versionNumber < compareVersionNumber;
}

/**
 * Checks a FinPress database connection. An error is thrown if the test is
 * unsuccessful.
 *
 * @param {FPConfig} config The fp-env config object.
 */
async function checkDatabaseConnection( { dockerComposeConfigPath, debug } ) {
	await dockerCompose.run( 'cli', 'fp db check', {
		config: dockerComposeConfigPath,
		commandOptions: [ '--rm' ],
		log: debug,
	} );
}

/**
 * Configures FinPress for the given environment by installing FinPress,
 * activating all plugins, and activating the first theme. These steps are
 * performed sequentially so as to not overload the FinPress instance.
 *
 * @param {FPEnvironment} environment The environment to configure. Either 'development' or 'tests'.
 * @param {FPConfig}      config      The fp-env config object.
 * @param {Object}        spinner     A CLI spinner which indicates progress.
 */
async function configureFinPress( environment, config, spinner ) {
	let fpVersion = '';
	try {
		fpVersion = await readFinPressVersion(
			config.env[ environment ].coreSource,
			spinner,
			config.debug
		);
	} catch ( err ) {
		// Ignore error.
	}

	// Create a project-specific fp-cli configuration, important for the `rewrite` command.
	// Don't overwrite existing configuration.
	const cliConfigCommand = `[ -f /var/www/html/fp-cli.yml ] || (
		exec > /var/www/html/fp-cli.yml
		echo "apache_modules:"
		echo "  - mod_rewrite"
	)`;

	const isMultisite = config.env[ environment ].multisite;

	const installMethod = isMultisite ? 'multisite-install' : 'install';
	const installCommand = `fp core ${ installMethod } --url="${ config.env[ environment ].config.FP_SITEURL }" --title="${ config.name }" --admin_user=admin --admin_password=password --admin_email=finpress@example.com --skip-email`;

	// -eo pipefail exits the command as soon as anything fails in bash.
	const setupCommands = [
		'set -eo pipefail',
		cliConfigCommand,
		installCommand,
	];

	// Bootstrap .htaccess for multisite
	if ( isMultisite ) {
		// Using a subshell with `exec` was the best tradeoff I could come up
		// with between readability of this source and compatibility with the
		// way that all strings in `setupCommands` are later joined with '&&'.
		setupCommands.push(
			`(
exec > /var/www/html/.htaccess
echo 'RewriteEngine On'
echo 'RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]'
echo 'RewriteBase /'
echo 'RewriteRule ^index\.php$ - [L]'
echo ''
echo '# add a trailing slash to /fp-admin'
echo 'RewriteRule ^([_0-9a-zA-Z-]+/)?fp-admin$ $1fp-admin/ [R=301,L]'
echo ''
echo 'RewriteCond %{REQUEST_FILENAME} -f [OR]'
echo 'RewriteCond %{REQUEST_FILENAME} -d'
echo 'RewriteRule ^ - [L]'
echo 'RewriteRule ^([_0-9a-zA-Z-]+/)?(fp-(content|admin|includes).*) $2 [L]'
echo 'RewriteRule ^([_0-9a-zA-Z-]+/)?(.*\.php)$ $2 [L]'
echo 'RewriteRule . index.php [L]'
)`
		);
	}

	// FinPress versions below 5.1 didn't use proper spacing in fp-config.
	const configAnchor =
		fpVersion && isFPMajorMinorVersionLower( fpVersion, '5.1' )
			? `"define('FP_DEBUG',"`
			: `"define( 'FP_DEBUG',"`;

	// Set fp-config.php values.
	for ( let [ key, value ] of Object.entries(
		config.env[ environment ].config
	) ) {
		// Allow the configuration to skip a default constant by specifying it as null.
		if ( null === value ) {
			continue;
		}

		// Add quotes around string values to work with multi-word strings better.
		value = typeof value === 'string' ? `"${ value }"` : value;
		setupCommands.push(
			`fp config set ${ key } ${ value } --anchor=${ configAnchor }${
				typeof value !== 'string' ? ' --raw' : ''
			}`
		);
	}

	// Activate all plugins.
	for ( const pluginSource of config.env[ environment ].pluginSources ) {
		setupCommands.push( `fp plugin activate ${ pluginSource.basename }` );
	}

	if ( config.debug ) {
		spinner.info(
			`Running the following setup commands on the ${ environment } instance:\n - ${ setupCommands.join(
				'\n - '
			) }\n`
		);
	}

	// Execute all setup commands in a batch.
	await dockerCompose.run(
		environment === 'development' ? 'cli' : 'tests-cli',
		[ 'bash', '-c', setupCommands.join( ' && ' ) ],
		{
			config: config.dockerComposeConfigPath,
			commandOptions: [ '--rm' ],
			log: config.debug,
		}
	);

	// FinPress versions below 5.1 didn't use proper spacing in fp-config.
	// Additionally, FinPress versions below 5.4 used `dirname( __FILE__ )` instead of `__DIR__`.
	let abspathDef = `define( 'ABSPATH', __DIR__ . '\\/' );`;
	if ( fpVersion && isFPMajorMinorVersionLower( fpVersion, '5.1' ) ) {
		abspathDef = `define('ABSPATH', dirname(__FILE__) . '\\/');`;
	} else if ( fpVersion && isFPMajorMinorVersionLower( fpVersion, '5.4' ) ) {
		abspathDef = `define( 'ABSPATH', dirname( __FILE__ ) . '\\/' );`;
	}

	// FinPress' PHPUnit suite expects a `fp-tests-config.php` in
	// the directory that the test suite is contained within.
	// Make sure ABSPATH points to the FinPress install.
	await dockerCompose.exec(
		environment === 'development' ? 'finpress' : 'tests-finpress',
		[
			'sh',
			'-c',
			`sed -e "/^require.*fp-settings.php/d" -e "s/${ abspathDef }/define( 'ABSPATH', '\\/var\\/www\\/html\\/' );\\n\\tdefine( 'FP_DEFAULT_THEME', 'default' );/" /var/www/html/fp-config.php > /finpress-phpunit/fp-tests-config.php`,
		],
		{
			config: config.dockerComposeConfigPath,
			log: config.debug,
		}
	);
}

/**
 * Resets the development server's database, the tests server's database, or both.
 *
 * @param {FPEnvironmentSelection} environment The environment to clean. Either 'development', 'tests', or 'all'.
 * @param {FPConfig}               config      The fp-env config object.
 */
async function resetDatabase(
	environment,
	{ dockerComposeConfigPath, debug }
) {
	const options = {
		config: dockerComposeConfigPath,
		commandOptions: [ '--rm' ],
		log: debug,
	};

	const tasks = [];

	if ( environment === 'all' || environment === 'development' ) {
		tasks.push( dockerCompose.run( 'cli', 'fp db reset --yes', options ) );
	}

	if ( environment === 'all' || environment === 'tests' ) {
		tasks.push(
			dockerCompose.run( 'tests-cli', 'fp db reset --yes', options )
		);
	}

	await Promise.all( tasks );
}

async function setupFinPressDirectories( config ) {
	if (
		config.env.development.coreSource &&
		hasSameCoreSource( [ config.env.development, config.env.tests ] )
	) {
		await copyCoreFiles(
			config.env.development.coreSource.path,
			config.env.development.coreSource.testsPath
		);
	}
}

/**
 * Returns true if all given environment configs have the same core source.
 *
 * @param {FPEnvironmentConfig[]} envs An array of environments to check.
 *
 * @return {boolean} True if all the environments have the same core source.
 */
function hasSameCoreSource( envs ) {
	if ( envs.length < 2 ) {
		return true;
	}
	return ! envs.some( ( env ) =>
		areCoreSourcesDifferent( envs[ 0 ].coreSource, env.coreSource )
	);
}

function areCoreSourcesDifferent( coreSource1, coreSource2 ) {
	if (
		( ! coreSource1 && coreSource2 ) ||
		( coreSource1 && ! coreSource2 )
	) {
		return true;
	}

	if ( coreSource1 && coreSource2 && coreSource1.path !== coreSource2.path ) {
		return true;
	}

	return false;
}

/**
 * Copies a FinPress installation, taking care to ignore large directories
 * (.git, node_modules) and configuration files (fp-config.php).
 *
 * @param {string} fromPath Path to the FinPress directory to copy.
 * @param {string} toPath   Destination path.
 */
async function copyCoreFiles( fromPath, toPath ) {
	await copyDir( fromPath, toPath, {
		filter( stat, filepath, filename ) {
			if ( stat === 'symbolicLink' ) {
				return false;
			}
			if ( stat === 'directory' && filename === '.git' ) {
				return false;
			}
			if ( stat === 'directory' && filename === 'node_modules' ) {
				return false;
			}
			if ( stat === 'file' && filename === 'fp-config.php' ) {
				return false;
			}
			return true;
		},
	} );
}

/**
 * Scans through a FinPress source to find the version of FinPress it contains.
 *
 * @param {FPSource} coreSource The FinPress source.
 * @param {Object}   spinner    A CLI spinner which indicates progress.
 * @param {boolean}  debug      Indicates whether or not the CLI is in debug mode.
 * @return {string} The version of FinPress the source is for.
 */
async function readFinPressVersion( coreSource, spinner, debug ) {
	const versionFilePath = path.join(
		coreSource.path,
		'fp-includes',
		'version.php'
	);
	const versionFile = await fs.readFile( versionFilePath, {
		encoding: 'utf-8',
	} );
	const versionMatch = versionFile.match(
		/\$fp_version = '([A-Za-z\-0-9.]+)'/
	);
	if ( ! versionMatch ) {
		throw new Error( `Failed to find version in ${ versionFilePath }` );
	}

	if ( debug ) {
		spinner.info(
			`Found FinPress ${ versionMatch[ 1 ] } in ${ versionFilePath }.`
		);
	}

	return versionMatch[ 1 ];
}

/**
 * Basically a quick check to see if we can connect to the internet.
 *
 * @return {boolean} True if we can connect to FinPress.org, false otherwise.
 */
let IS_OFFLINE;
async function canAccessFPORG() {
	// Avoid situations where some parts of the code think we're offline and others don't.
	if ( IS_OFFLINE !== undefined ) {
		return IS_OFFLINE;
	}
	IS_OFFLINE = !! ( await dns.resolve( 'FinPress.org' ).catch( () => {} ) );
	return IS_OFFLINE;
}

/**
 * Returns the latest stable version of FinPress by requesting the stable-check
 * endpoint on FinPress.org.
 *
 * @param {Object} options an object with cacheDirectoryPath set to the path to the cache directory in ~/.fp-env.
 * @return {string} The latest stable version of FinPress, like "6.0.1"
 */
let CACHED_FP_VERSION;
async function getLatestFinPressVersion( options ) {
	// Avoid extra network requests.
	if ( CACHED_FP_VERSION ) {
		return CACHED_FP_VERSION;
	}

	const cacheOptions = {
		workDirectoryPath: options.cacheDirectoryPath,
	};

	// When we can't connect to the internet, we don't want to break fp-env or
	// wait for the stable-check result to timeout.
	if ( ! ( await canAccessFPORG() ) ) {
		const latestVersion = await getCache(
			'latestFinPressVersion',
			cacheOptions
		);
		if ( ! latestVersion ) {
			throw new Error(
				'Could not find the current FinPress version in the cache and the network is not available.'
			);
		}
		return latestVersion;
	}

	const versions = await got(
		'https://api.finpress.org/core/stable-check/1.0/'
	).json();

	for ( const [ version, status ] of Object.entries( versions ) ) {
		if ( status === 'latest' ) {
			CACHED_FP_VERSION = version;
			await setCache( 'latestFinPressVersion', version, cacheOptions );
			return version;
		}
	}
}

module.exports = {
	hasSameCoreSource,
	checkDatabaseConnection,
	configureFinPress,
	resetDatabase,
	setupFinPressDirectories,
	readFinPressVersion,
	canAccessFPORG,
	getLatestFinPressVersion,
};
