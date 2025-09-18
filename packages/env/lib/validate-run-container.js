'use strict';

/**
 * A list of the containers that we can use `run` on.
 */
const RUN_CONTAINERS = [
	'mysql',
	'tests-mysql',
	'finpress',
	'tests-finpress',
	'cli',
	'tests-cli',
	'phpmyadmin',
];

/**
 * Custom parsing and validation for the "run" command's container argument.
 *
 * @param {string} value The user-set container.
 *
 * @return {string} The container name to use.
 */
function validateRunContainer( value ) {
	// Give special errors for deprecated containers.
	if ( value === 'phpunit' ) {
		throw new Error(
			"The 'phpunit' container has been removed. Please use 'fin-env run tests-cli --env-cwd=fin-content/path/to/plugin phpunit' instead."
		);
	}
	if ( value === 'composer' ) {
		throw new Error(
			"The 'composer' container has been removed. Please use 'fin-env run cli --env-cwd=fin-content/path/to/plugin composer' instead."
		);
	}

	return value;
}

module.exports = {
	RUN_CONTAINERS,
	validateRunContainer,
};
