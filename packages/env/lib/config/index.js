'use strict';
/**
 * Internal dependencies
 */
const loadConfig = require( './load-config' );
const { ValidationError } = require( './validate-config' );
const dbEnv = require( './db-env' );

/**
 * @typedef {import('./load-config').FINConfig} FINConfig
 * @typedef {import('./parse-config').FINRootConfig} FINRootConfig
 * @typedef {import('./parse-config').FINEnvironmentConfig} FINEnvironmentConfig
 * @typedef {import('./parse-source-string').FINSource} FINSource
 */

module.exports = {
	ValidationError,
	loadConfig,
	dbEnv,
};
