/**
 * External dependencies
 */
import spawn from 'cross-spawn';
import { resolveBinSync } from 'resolve-bin';

/**
 * Internal dependencies
 */
import { getWebpackArgs } from '../utils/config.js';
const EXIT_ERROR_CODE = 1;

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const { status } = spawn.sync( resolveBinSync( 'webpack' ), getWebpackArgs(), {
	stdio: 'inherit',
} );
process.exit( status === null ? EXIT_ERROR_CODE : status );
