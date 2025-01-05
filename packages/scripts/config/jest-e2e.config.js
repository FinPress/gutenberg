/**
 * External dependencies
 */
import { fileURLToPath } from 'url';
import path from 'path';

/**
 * Internal dependencies
 */
import { hasBabelConfig } from '../utils/config.js';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );

const jestE2EConfig = {
	globalSetup: path.join( __dirname, 'jest-environment-puppeteer', 'setup' ),
	globalTeardown: path.join(
		__dirname,
		'jest-environment-puppeteer',
		'teardown'
	),
	reporters: [
		'default',
		path.join( __dirname, 'jest-github-actions-reporter', 'index.js' ),
	],
	setupFilesAfterEnv: [ 'expect-puppeteer' ],
	testEnvironment: path.join( __dirname, 'jest-environment-puppeteer' ),
	testMatch: [ '**/specs/**/*.[jt]s?(x)', '**/?(*.)spec.[jt]s?(x)' ],
	testPathIgnorePatterns: [ '/node_modules/' ],
	testRunner: 'jest-circus/runner',
	testTimeout: 30000,
};

if ( ! hasBabelConfig() ) {
	jestE2EConfig.transform = {
		'\\.[jt]sx?$': path.join( __dirname, 'babel-transform' ),
	};
}

export default jestE2EConfig;
