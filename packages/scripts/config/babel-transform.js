/**
 * External dependencies
 */
import babelJest from 'babel-jest';
// TODO: this was resolved so remove this workaround when https://github.com/facebook/jest/issues/11444 gets resolved in Jest.
const babelJestInterop = babelJest.__esModule ? babelJest.default : babelJest;

export default babelJestInterop.createTransformer( {
	presets: [ '@wordpress/babel-preset-default' ],
} );
