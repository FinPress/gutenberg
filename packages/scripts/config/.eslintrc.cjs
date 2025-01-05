/**
 * External dependencies
 */
const importSync = require( 'import-sync' );

/**
 * Internal dependencies
 */
const { hasBabelConfig } = importSync( '../utils/config.js' );

const eslintConfig = {
	root: true,
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ],
	overrides: [
		{
			// Unit test files and their helpers only.
			files: [ '**/@(test|__tests__)/**/*.js', '**/?(*.)test.js' ],
			extends: [ 'plugin:@wordpress/eslint-plugin/test-unit' ],
		},
	],
};

if ( ! hasBabelConfig() ) {
	eslintConfig.parserOptions = {
		requireConfigFile: false,
		babelOptions: {
			presets: [ require.resolve( '@wordpress/babel-preset-default' ) ],
		},
	};
}
// TODO: Update this ESLint 9 so ESM modules can be used with a eslint.config.mjs
module.exports = eslintConfig;
