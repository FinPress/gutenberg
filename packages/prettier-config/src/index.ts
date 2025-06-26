/**
 * External dependencies
 */
import type { Config as PrettierConfig } from 'prettier';
const packageJson = require( require.resolve( 'prettier/package.json' ) );

interface WPPrettierOptions {
	/** Insert spaces inside parentheses. */
	parenSpacing?: boolean;
}

const isWPPrettier = packageJson.name === 'wp-prettier';
const customOptions: WPPrettierOptions = isWPPrettier
	? { parenSpacing: true }
	: {};
const customStyleOptions: WPPrettierOptions = isWPPrettier
	? { parenSpacing: false }
	: {};

const config: PrettierConfig & WPPrettierOptions = {
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
