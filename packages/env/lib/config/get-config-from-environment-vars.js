'use strict';
/**
 * Internal dependencies
 */
const {
	parseSourceString,
	includeTestsPath,
} = require( './parse-source-string' );
const { checkPort, checkVersion, checkString } = require( './validate-config' );

/**
 * @typedef {import('./parse-source-string').FPSource} FPSource
 */

/**
 * Environment variable configuration.
 *
 * @typedef FPEnvironmentVariableConfig
 * @property {?number}                  port             An override for the development environment's port.
 * @property {?number}                  mysqlPort        An override for the development environment's MySQL port.
 * @property {?number}                  testsPort        An override for the testing environment's port.
 * @property {?number}                  testsMysqlPort   An override for the testing environment's MySQL port.
 * @property {?number}                  phpmyadminPort   An override for the development environment's phpMyAdmin port.
 * @property {?FPSource}                coreSource       An override for all environment's coreSource.
 * @property {?string}                  phpVersion       An override for all environment's PHP version.
 * @property {?boolean}                 multisite        An override for if environmen should be multisite.
 * @property {?Object.<string, string>} lifecycleScripts An override for various lifecycle scripts.
 */

/**
 * Gets configuration options from environment variables.
 *
 * @param {string} cacheDirectoryPath Path to the work directory located in ~/.fp-env.
 *
 * @return {FPEnvironmentVariableConfig} Any configuration options parsed from the environment variables.
 */
module.exports = function getConfigFromEnvironmentVars( cacheDirectoryPath ) {
	const environmentConfig = {
		port: getPortFromEnvironmentVariable( 'FP_ENV_PORT' ),
		mysqlPort: getPortFromEnvironmentVariable( 'FP_ENV_MYSQL_PORT' ),
		testsPort: getPortFromEnvironmentVariable( 'FP_ENV_TESTS_PORT' ),
		testsMysqlPort: getPortFromEnvironmentVariable(
			'FP_ENV_TESTS_MYSQL_PORT'
		),
		phpmyadminPort: getPortFromEnvironmentVariable(
			'FP_ENV_PHPMYADMIN_PORT'
		),
		testsPhpmyadminPort: getPortFromEnvironmentVariable(
			'FP_ENV_TESTS_PHPMYADMIN_PORT'
		),
		lifecycleScripts: getLifecycleScriptOverrides(),
	};

	if ( process.env.FP_ENV_CORE ) {
		environmentConfig.coreSource = includeTestsPath(
			parseSourceString( process.env.FP_ENV_CORE, {
				cacheDirectoryPath,
			} ),
			{ cacheDirectoryPath }
		);
	}

	if ( process.env.FP_ENV_PHP_VERSION ) {
		checkVersion(
			'environment variable',
			'FP_ENV_PHP_VERSION',
			process.env.FP_ENV_PHP_VERSION
		);
		environmentConfig.phpVersion = process.env.FP_ENV_PHP_VERSION;
	}

	if ( process.env.FP_ENV_MULTISITE ) {
		environmentConfig.multisite = !! process.env.FP_ENV_MULTISITE;
	}

	return environmentConfig;
};

/**
 * Parses an environment variable which should be a port.
 *
 * @param {string} varName The environment variable to check (e.g. FP_ENV_PORT).
 *
 * @return {number} The parsed port number.
 */
function getPortFromEnvironmentVariable( varName ) {
	if ( ! process.env[ varName ] ) {
		return undefined;
	}

	const port = parseInt( process.env[ varName ] );

	// Throw an error if it is not parseable as a number.
	checkPort( 'environment variable', varName, port );

	return port;
}

/**
 * Parses the lifecycle script environment variables.
 *
 * @return {Object.<string, string>} The parsed lifecycle scripts.
 */
function getLifecycleScriptOverrides() {
	const lifecycleScripts = {};

	// Find all of the lifecycle script overrides and parse them.
	const lifecycleEnvironmentVars = {
		FP_ENV_LIFECYCLE_SCRIPT_AFTER_START: 'afterStart',
		FP_ENV_LIFECYCLE_SCRIPT_AFTER_CLEAN: 'afterClean',
		FP_ENV_LIFECYCLE_SCRIPT_AFTER_DESTROY: 'afterDestroy',
	};
	for ( const envVar in lifecycleEnvironmentVars ) {
		const scriptValue = process.env[ envVar ];
		if ( scriptValue === undefined ) {
			continue;
		}

		checkString( 'environment variable', envVar, scriptValue );
		lifecycleScripts[ lifecycleEnvironmentVars[ envVar ] ] = scriptValue;
	}

	return lifecycleScripts;
}
