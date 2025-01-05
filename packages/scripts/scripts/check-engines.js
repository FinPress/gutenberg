/**
 * External dependencies
 */
import spawn from 'cross-spawn';
import { resolveBinSync } from 'resolve-bin';

/**
 * Internal dependencies
 */
import { getArgsFromCLI } from '../utils/process.js';
import { hasArgInCLI } from '../utils/cli.js';
import { getPackageProp } from '../utils/package.js';

const getConfig = () => {
	const hasConfig =
		hasArgInCLI( '--package' ) ||
		hasArgInCLI( '--node' ) ||
		hasArgInCLI( '--npm' ) ||
		hasArgInCLI( '--yarn' );

	if ( hasConfig ) {
		return [];
	}
	const { node, npm } =
		getPackageProp( 'engines' ) || require( '../package.json' ).engines;

	return [ '--node', node, '--npm', npm ];
};

const result = spawn.sync(
	resolveBinSync( 'check-node-version' ),
	[ ...getConfig(), ...getArgsFromCLI() ],
	{
		stdio: 'inherit',
	}
);

process.exit( result.status );
