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

const defaultFilesArgs = hasFileArgInCLI() ? [] : [ '.' ];

// See: https://npmpackagejsonlint.org/docs/en/configuration
const hasLintConfig =
	hasArgInCLI( '-c' ) ||
	hasArgInCLI( '--configFile' ) ||
	hasProjectFile( '.npmpackagejsonlintrc.js' ) ||
	hasProjectFile( '.npmpackagejsonlintrc.json' ) ||
	hasProjectFile( '.npmpackagejsonlintrc.yaml' ) ||
	hasProjectFile( '.npmpackagejsonlintrc.yml' ) ||
	hasProjectFile( 'npmpackagejsonlint.config.js' ) ||
	hasProjectFile( '.npmpackagejsonlintrc' ) ||
	hasPackageProp( 'npmpackagejsonlint' ) ||
	// npm-package-json-lint v3.x used a different prop name.
	hasPackageProp( 'npmPackageJsonLintConfig' );

const defaultConfigArgs = ! hasLintConfig
	? [ '--configFile', fromConfigRoot( 'npmpackagejsonlint.json' ) ]
	: [];

// See: https://github.com/tclindner/npm-package-json-lint/#cli-commands-and-configuration.
const hasIgnoredFiles =
	hasArgInCLI( '--ignorePath' ) ||
	hasProjectFile( '.npmpackagejsonlintignore' );

const defaultIgnoreArgs = ! hasIgnoredFiles
	? [ '--ignorePath', fromConfigRoot( '.npmpackagejsonlintignore' ) ]
	: [];

const result = spawn.sync(
	resolveBinSync( 'npm-package-json-lint', { executable: 'npmPkgJsonLint' } ),
	[
		...defaultConfigArgs,
		...defaultIgnoreArgs,
		...args,
		...defaultFilesArgs,
	],
	{ stdio: 'inherit' }
);

process.exit( result.status );
