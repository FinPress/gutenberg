'use strict';
/**
 * Internal dependencies
 */
const loadConfig = require( './load-config' );
const { ValidationError } = require( './validate-config' );
const dbEnv = require( './db-env' );

/**
 * @typedef {import('./load-config').FPConfig} FPConfig
 * @typedef {import('./parse-config').FPRootConfig} FPRootConfig
 * @typedef {import('./parse-config').FPEnvironmentConfig} FPEnvironmentConfig
 * @typedef {import('./parse-source-string').FPSource} FPSource
 */

module.exports = {
	ValidationError,
	loadConfig,
	dbEnv,
};
