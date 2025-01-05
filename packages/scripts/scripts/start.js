/**
 * External dependencies
 */
import spawn from 'cross-spawn';
import { resolveBinSync } from 'resolve-bin';

/**
 * Internal dependencies
 */
import { getWebpackArgs } from '../utils/config.js';
import { hasArgInCLI } from '../utils/cli.js';
const EXIT_ERROR_CODE = 1;

const webpackArgs = getWebpackArgs();
if ( hasArgInCLI( '--hot' ) ) {
	webpackArgs.unshift( 'serve' );
} else if ( ! hasArgInCLI( '--no-watch' ) ) {
	webpackArgs.unshift( 'watch' );
}

const { status } = spawn.sync( resolveBinSync( 'webpack' ), webpackArgs, {
	stdio: 'inherit',
} );
process.exit( status === null ? EXIT_ERROR_CODE : status );
