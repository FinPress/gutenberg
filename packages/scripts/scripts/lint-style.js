/**
 * External dependencies
 */
import spawn from 'cross-spawn';
import { resolveBinSync } from 'resolve-bin';

/**
 * Internal dependencies
 */
import { fromConfigRoot, hasProjectFile } from '../utils/file.js';
import { getArgsFromCLI } from '../utils/process.js';
import { hasArgInCLI, hasFileArgInCLI } from '../utils/cli.js';
import { hasPackageProp } from '../utils/package.js';

const args = getArgsFromCLI();

const defaultFilesArgs = hasFileArgInCLI() ? [] : [ '**/*.{css,pcss,scss}' ];

// See: https://stylelint.io/user-guide/configuration
const hasLintConfig =
	hasArgInCLI( '--config' ) ||
	hasProjectFile( '.stylelintrc.js' ) ||
	hasProjectFile( '.stylelintrc.json' ) ||
	hasProjectFile( '.stylelintrc.yaml' ) ||
	hasProjectFile( '.stylelintrc.yml' ) ||
	hasProjectFile( 'stylelint.config.js' ) ||
	hasProjectFile( '.stylelintrc' ) ||
	hasPackageProp( 'stylelint' );

const defaultConfigArgs = ! hasLintConfig
	? [ '--config', fromConfigRoot( '.stylelintrc.json' ) ]
	: [];

// See: https://github.com/stylelint/stylelint/blob/HEAD/docs/user-guide/ignore-code.md#files-entirely.
const hasIgnoredFiles =
	hasArgInCLI( '--ignore-path' ) || hasProjectFile( '.stylelintignore' );

const defaultIgnoreArgs = ! hasIgnoredFiles
	? [ '--ignore-path', fromConfigRoot( '.stylelintignore' ) ]
	: [];

const result = spawn.sync(
	resolveBinSync( 'stylelint' ),
	[
		...defaultConfigArgs,
		...defaultIgnoreArgs,
		...args,
		...defaultFilesArgs,
	],
	{ stdio: 'inherit' }
);

process.exit( result.status );
