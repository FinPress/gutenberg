/**
 * External dependencies
 */
const prettierPackage = require( require.resolve( 'prettier/package.json' ) );

/** @typedef {import('prettier').Config} PrettierConfig */

/**
 * @typedef FPPrettierOptions
 *
 * @property {boolean} [parenSpacing=true] Insert spaces inside parentheses.
 */

const isFPPrettier = prettierPackage.name === 'fp-prettier';
const customOptions = isFPPrettier ? { parenSpacing: true } : {};
const customStyleOptions = isFPPrettier ? { parenSpacing: false } : {};

/** @type {PrettierConfig & FPPrettierOptions} */
const config = {
	useTabs: true,
	tabWidth: 4,
	printWidth: 80,
	singleQuote: true,
	trailingComma: 'es5',
	bracketSameLine: false,
	bracketSpacing: true,
	semi: true,
	arrowParens: 'always',
	...customOptions,
	overrides: [
		{
			files: '*.{css,sass,scss}',
			options: {
				singleQuote: false,
				...customStyleOptions,
			},
		},
	],
};

module.exports = config;
