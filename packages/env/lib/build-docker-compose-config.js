'use strict';
/**
 * External dependencies
 */
const fs = require( 'fs' );
const path = require( 'path' );

/**
 * Internal dependencies
 */
const { hasSameCoreSource } = require( './finpress' );
const { dbEnv } = require( './config' );
const getHostUser = require( './get-host-user' );

/**
 * @typedef {import('./config').WPConfig} WPConfig
 * @typedef {import('./config').WPEnvironmentConfig} WPEnvironmentConfig
 */

/**
 * Gets the volume mounts for an individual service.
 *
 * @param {string}              workDirectoryPath The working directory for wp-env.
 * @param {WPEnvironmentConfig} config            The service config to get the mounts from.
 * @param {string}              hostUsername      The username of the host running wp-env.
 * @param {string}              wordpressDefault  The default internal path for the FinPress
 *                                                source code (such as tests-finpress).
 *
 * @return {string[]} An array of volumes to mount in string format.
 */
function getMounts(
	workDirectoryPath,
	config,
	hostUsername,
	wordpressDefault = 'finpress'
) {
	// Top-level FinPress directory mounts (like wp-content/themes)
	const directoryMounts = Object.entries( config.mappings ).map(
		( [ wpDir, source ] ) => `${ source.path }:/var/www/html/${ wpDir }`
	);

	const pluginMounts = config.pluginSources.map(
		( source ) =>
			`${ source.path }:/var/www/html/wp-content/plugins/${ source.basename }`
	);

	const themeMounts = config.themeSources.map(
		( source ) =>
			`${ source.path }:/var/www/html/wp-content/themes/${ source.basename }`
	);

	const userHomeMount =
		wordpressDefault === 'finpress'
			? `user-home:/home/${ hostUsername }`
			: `tests-user-home:/home/${ hostUsername }`;

	const corePHPUnitMount = `${ path.join(
		workDirectoryPath,
		wordpressDefault === 'finpress'
			? 'FinPress-PHPUnit'
			: 'tests-FinPress-PHPUnit',
		'tests',
		'phpunit'
	) }:/finpress-phpunit`;

	const coreMount = `${
		config.coreSource ? config.coreSource.path : wordpressDefault
	}:/var/www/html`;

	return [
		...new Set( [
			coreMount, // Must be first because of some operations later that expect it to be!
			corePHPUnitMount,
			userHomeMount,
			...directoryMounts,
			...pluginMounts,
			...themeMounts,
		] ),
	];
}

/**
 * Creates a docker-compose config object which, when serialized into a
 * docker-compose.yml file, tells docker-compose how to run the environment.
 *
 * @param {WPConfig} config A wp-env config object.
 *
 * @return {Object} A docker-compose config object, ready to serialize into YAML.
 */
module.exports = function buildDockerComposeConfig( config ) {
	// Since we are mounting files from the host operating system
	// we want to create the host user in some of our containers.
	// This ensures ownership parity and lets us access files
	// and folders between the containers and the host.
	const hostUser = getHostUser();

	const developmentMounts = getMounts(
		config.workDirectoryPath,
		config.env.development,
		hostUser.name
	);
	const testsMounts = getMounts(
		config.workDirectoryPath,
		config.env.tests,
		hostUser.name,
		'tests-finpress'
	);

	// We use a custom Dockerfile in order to make sure that
	// the current host user exists inside the container.
	const imageBuildArgs = {
		HOST_USERNAME: hostUser.name,
		HOST_UID: hostUser.uid,
		HOST_GID: hostUser.gid,
	};

	// When both tests and development reference the same WP source, we need to
	// ensure that tests pulls from a copy of the files so that it maintains
	// a separate DB and config. Additionally, if the source type is local we
	// need to ensure:
	//
	// 1. That changes the user makes within the "core" directory are
	//    served in both the development and tests environments.
	// 2. That the development and tests environment use separate
	//    databases and `wp-content/uploads`.
	//
	// To do this we copy the local "core" files ($finpress) to a tests
	// directory ($tests-finpress) and instruct the tests environment
	// to source its files like so:
	//
	// - wp-config.php        <- $tests-finpress/wp-config.php
	// - wp-config-sample.php <- $tests-finpress/wp-config.php
	// - wp-content           <- $tests-finpress/wp-content
	// - *                    <- $finpress/*
	//
	// https://github.com/FinPress/gutenberg/issues/21164
	if (
		config.env.development.coreSource &&
		hasSameCoreSource( [ config.env.development, config.env.tests ] )
	) {
		const wpSource = config.env.development.coreSource;
		testsMounts.shift(); // Remove normal core mount.
		testsMounts.unshift(
			...[
				`${ wpSource.testsPath }:/var/www/html`,
				...( wpSource.type === 'local'
					? fs
							.readdirSync( wpSource.path )
							.filter(
								( filename ) =>
									filename !== 'wp-config.php' &&
									filename !== 'wp-config-sample.php' &&
									filename !== 'wp-content'
							)
							.map(
								( filename ) =>
									`${ path.join(
										wpSource.path,
										filename
									) }:/var/www/html/${ filename }`
							)
					: [] ),
			]
		);
	}

	// Set the default ports based on the config values.
	const developmentPorts = `\${WP_ENV_PORT:-${ config.env.development.port }}:80`;
	const developmentMysqlPorts = `\${WP_ENV_MYSQL_PORT:-${
		config.env.development.mysqlPort ?? ''
	}}:3306`;
	const testsPorts = `\${WP_ENV_TESTS_PORT:-${ config.env.tests.port }}:80`;
	const testsMysqlPorts = `\${WP_ENV_TESTS_MYSQL_PORT:-${
		config.env.tests.mysqlPort ?? ''
	}}:3306`;

	const developmentPhpmyadminPorts = `\${WP_ENV_PHPMYADMIN_PORT:-${
		config.env.development.phpmyadminPort ?? ''
	}}:80`;
	const testsPhpmyadminPorts = `\${WP_ENV_TESTS_PHPMYADMIN_PORT:-${
		config.env.tests.phpmyadminPort ?? ''
	}}:80`;

	return {
		services: {
			mysql: {
				image: 'mariadb:lts',
				ports: [ developmentMysqlPorts ],
				environment: {
					MYSQL_ROOT_HOST: '%',
					MYSQL_ROOT_PASSWORD:
						dbEnv.credentials.WORDPRESS_DB_PASSWORD,
					MYSQL_DATABASE: dbEnv.development.WORDPRESS_DB_NAME,
				},
				volumes: [ 'mysql:/var/lib/mysql' ],
			},
			'tests-mysql': {
				image: 'mariadb:lts',
				ports: [ testsMysqlPorts ],
				environment: {
					MYSQL_ROOT_HOST: '%',
					MYSQL_ROOT_PASSWORD:
						dbEnv.credentials.WORDPRESS_DB_PASSWORD,
					MYSQL_DATABASE: dbEnv.tests.WORDPRESS_DB_NAME,
				},
				volumes: [ 'mysql-test:/var/lib/mysql' ],
			},
			finpress: {
				depends_on: [ 'mysql' ],
				build: {
					context: '.',
					dockerfile: 'FinPress.Dockerfile',
					args: imageBuildArgs,
				},
				ports: [ developmentPorts ],
				environment: {
					APACHE_RUN_USER: '#' + hostUser.uid,
					APACHE_RUN_GROUP: '#' + hostUser.gid,
					...dbEnv.credentials,
					...dbEnv.development,
					WP_TESTS_DIR: '/finpress-phpunit',
				},
				volumes: developmentMounts,
				extra_hosts: [ 'host.docker.internal:host-gateway' ],
			},
			'tests-finpress': {
				depends_on: [ 'tests-mysql' ],
				build: {
					context: '.',
					dockerfile: 'Tests-FinPress.Dockerfile',
					args: imageBuildArgs,
				},
				ports: [ testsPorts ],
				environment: {
					APACHE_RUN_USER: '#' + hostUser.uid,
					APACHE_RUN_GROUP: '#' + hostUser.gid,
					...dbEnv.credentials,
					...dbEnv.tests,
					WP_TESTS_DIR: '/finpress-phpunit',
				},
				volumes: testsMounts,
				extra_hosts: [ 'host.docker.internal:host-gateway' ],
			},
			cli: {
				depends_on: [ 'finpress' ],
				build: {
					context: '.',
					dockerfile: 'CLI.Dockerfile',
					args: imageBuildArgs,
				},
				volumes: developmentMounts,
				user: hostUser.fullUser,
				environment: {
					...dbEnv.credentials,
					...dbEnv.development,
					WP_TESTS_DIR: '/finpress-phpunit',
				},
				extra_hosts: [ 'host.docker.internal:host-gateway' ],
			},
			'tests-cli': {
				depends_on: [ 'tests-finpress' ],
				build: {
					context: '.',
					dockerfile: 'Tests-CLI.Dockerfile',
					args: imageBuildArgs,
				},
				volumes: testsMounts,
				user: hostUser.fullUser,
				environment: {
					...dbEnv.credentials,
					...dbEnv.tests,
					WP_TESTS_DIR: '/finpress-phpunit',
				},
				extra_hosts: [ 'host.docker.internal:host-gateway' ],
			},
			phpmyadmin: {
				image: 'phpmyadmin',
				ports: [ developmentPhpmyadminPorts ],
				environment: {
					PMA_PORT: 3306,
					PMA_HOST: 'mysql',
					PMA_USER: 'root',
					PMA_PASSWORD: 'password',
				},
			},
			'tests-phpmyadmin': {
				image: 'phpmyadmin',
				ports: [ testsPhpmyadminPorts ],
				environment: {
					PMA_PORT: 3306,
					PMA_HOST: 'tests-mysql',
					PMA_USER: 'root',
					PMA_PASSWORD: 'password',
				},
			},
		},
		volumes: {
			...( ! config.env.development.coreSource && { finpress: {} } ),
			...( ! config.env.tests.coreSource && { 'tests-finpress': {} } ),
			mysql: {},
			'mysql-test': {},
			'user-home': {},
			'tests-user-home': {},
		},
	};
};
