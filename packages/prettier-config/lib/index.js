/**
 * External dependencies
 */
const prettierPackage = require( require.resolve( 'prettier/package.json' ) );

/** @typedef {import('prettier').Config} PrettierConfig */

/**
 * @typedef FINPrettierOptions
 *
 * @property {boolean} [parenSpacing=true] Insert spaces inside parentheses.
 */

const isFINPrettier = prettierPackage.name === 'fin-prettier';
const customOptions = isFINPrettier ? { parenSpacing: true } : {};
const customStyleOptions = isFINPrettier ? { parenSpacing: false } : {};

/** @type {PrettierConfig & FINPrettierOptions} */
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
