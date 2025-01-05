/**
 * External dependencies
 */
import { exit, stdout } from 'node:process';

/**
 * External dependencies
 */
import pc from 'picocolors';
import spawn from 'cross-spawn';
import { resolveBinSync } from 'resolve-bin';
import dirGlob from 'dir-glob';
import { readPackageUpSync } from 'read-package-up';
// TODO: Remove this once https://nodejs.org/api/esm.html#importmetaresolvespecifier is stable.
import { createRequire } from 'module';
const require = createRequire( import.meta.url );

/**
 * Internal dependencies
 */
import {
	fromConfigRoot,
	fromProjectRoot,
	hasProjectFile,
} from '../utils/file.js';
import {
	getArgFromCLI,
	getFileArgsFromCLI,
	hasArgInCLI,
} from '../utils/cli.js';
import { hasPrettierConfig } from '../utils/config.js';

// Check if the project has wp-prettier installed and if the project has a Prettier config.
function checkPrettier() {
	try {
		const prettierResolvePath = require.resolve( 'prettier' );
		const prettierPackageJson = readPackageUpSync( {
			cwd: prettierResolvePath,
		} );
		const prettierPackageName = prettierPackageJson.packageJson.name;

		if (
			! [ 'wp-prettier', '@wordpress/prettier' ].includes(
				prettierPackageName
			)
		) {
			return {
				success: false,
				message:
					pc.red(
						'Incompatible version of Prettier was found in your project\n'
					) +
					"You need to install the 'wp-prettier' package to get " +
					'code formatting compliant with the WordPress coding standards.\n\n',
			};
		}
	} catch {
		return {
			success: false,
			message:
				pc.red(
					"The 'prettier' package was not found in your project\n"
				) +
				"You need to install the 'wp-prettier' package under an alias to get " +
				'code formatting compliant with the WordPress coding standards.\n\n',
		};
	}

	return { success: true };
}

const checkResult = checkPrettier();
if ( ! checkResult.success ) {
	stdout.write( checkResult.message );
	exit( 1 );
}

// Check for existing config in project, if it exists no command-line args are
// needed for config, otherwise pass in args to default config in packages
// See: https://prettier.io/docs/en/configuration.html
let configArgs = [];
if ( ! hasPrettierConfig() ) {
	configArgs = [
		'--config',
		require.resolve( '@wordpress/prettier-config' ),
	];
}

// If `--ignore-path` is not explicitly specified, use the project's or global .prettierignore.
let ignorePath = getArgFromCLI( '--ignore-path' );
if ( ! ignorePath ) {
	if ( hasProjectFile( '.prettierignore' ) ) {
		ignorePath = fromProjectRoot( '.prettierignore' );
	} else {
		ignorePath = fromConfigRoot( '.prettierignore' );
	}
}
const ignoreArgs = [ '--ignore-path', ignorePath ];

// Forward the --require-pragma option that formats only files that already have the @format
// pragma in the first docblock.
const pragmaArgs = hasArgInCLI( '--require-pragma' )
	? [ '--require-pragma' ]
	: [];

// Get the files and directories to format and convert them to globs.
let fileArgs = getFileArgsFromCLI();
if ( fileArgs.length === 0 ) {
	fileArgs = [ '.' ];
}

// Converts `foo/bar` directory to `foo/bar/**/*.js`
const globArgs = dirGlob.sync( fileArgs, {
	extensions: [ 'js', 'jsx', 'json', 'ts', 'tsx', 'yml', 'yaml' ],
} );

const result = spawn.sync(
	resolveBinSync( 'prettier' ),
	[ '--write', ...configArgs, ...ignoreArgs, ...pragmaArgs, ...globArgs ],
	{ stdio: 'inherit' }
);

process.exit( result.status );
