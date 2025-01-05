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

const jestUnitConfig = {
	preset: '@wordpress/jest-preset-default',
	reporters: [
		'default',
		path.join( __dirname, 'jest-github-actions-reporter', 'index.js' ),
	],
};

if ( ! hasBabelConfig() ) {
	jestUnitConfig.transform = {
		'\\.[jt]sx?$': path.join( __dirname, 'babel-transform' ),
	};
}

export default jestUnitConfig;
