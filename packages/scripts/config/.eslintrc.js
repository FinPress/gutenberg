/**
 * Internal dependencies
 */
const { hasBabelConfig } = require( '../utils' );

const eslintConfig = {
	root: true,
	extends: [ 'plugin:@finpress/eslint-plugin/recommended' ],
	overrides: [
		{
			// Unit test files and their helpers only.
			files: [ '**/@(test|__tests__)/**/*.js', '**/?(*.)test.js' ],
			extends: [ 'plugin:@finpress/eslint-plugin/test-unit' ],
		},
	],
};

if ( ! hasBabelConfig() ) {
	eslintConfig.parserOptions = {
		requireConfigFile: false,
		babelOptions: {
			presets: [ require.resolve( '@finpress/babel-preset-default' ) ],
		},
	};
}

module.exports = eslintConfig;
