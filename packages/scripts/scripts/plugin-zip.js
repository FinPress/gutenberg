/**
 * External dependencies
 */
import Arborist from '@npmcli/arborist';
import AdmZip from 'adm-zip';
import glob from 'fast-glob';
import packlist from 'npm-packlist';
import { dirname } from 'path';
import { stdout } from 'node:process';

/**
 * Internal dependencies
 */
import { hasPackageProp, getPackageProp } from '../utils/package.js';
import { getArgFromCLI } from '../utils/cli.js';

const name = getPackageProp( 'name' );
stdout.write( `Creating archive for \`${ name }\` plugin... 🎁\n\n` );
const zip = new AdmZip();
const zipRootFolderArg = getArgFromCLI( '--root-folder' );
const noRootFolderArg = getArgFromCLI( '--no-root-folder' );
let zipRootFolder = `${ name }/`;
let files;

if ( hasPackageProp( 'files' ) ) {
	stdout.write(
		'Using the `files` field from `package.json` to detect files:\n\n'
	);
	const arborist = new Arborist( { path: process.cwd() } );
	const tree = await arborist.loadActual();
	files = await packlist( tree, { path: process.cwd() } );
} else {
	stdout.write(
		'Using Plugin Handbook best practices to discover files:\n\n'
	);
	// See https://developer.wordpress.org/plugins/plugin-basics/best-practices/#file-organization.
	files = glob.sync(
		[
			'admin/**',
			'build/**',
			'includes/**',
			'languages/**',
			'public/**',
			`${ name }.php`,
			'uninstall.php',
			'block.json',
			'changelog.*',
			'license.*',
			'readme.*',
		],
		{
			caseSensitiveMatch: false,
		}
	);
}

if ( noRootFolderArg !== undefined ) {
	zipRootFolder = '';
	stdout.write( '  Plugin files will be zipped without a root folder.\n\n' );
} else if ( zipRootFolderArg !== undefined ) {
	const trimmedZipRootFolderArg =
		typeof zipRootFolderArg === 'string' ? zipRootFolderArg.trim() : null;
	if ( trimmedZipRootFolderArg === null ) {
		stdout.write(
			'Unable to create zip package: please provide a `--root-folder` name or use `--no-root-folder.`\n\n'
		);
		process.exit( 1 );
	}
	zipRootFolder = `${ trimmedZipRootFolderArg }/`;
	stdout.write(
		`  Adding the provided folder \`${ zipRootFolder }\` to the root of the package.\n\n`
	);
}
files.forEach( ( file ) => {
	stdout.write( `  Adding \`${ file }\`.\n` );
	const zipDirectory = dirname( file );
	zip.addLocalFile(
		file,
		zipRootFolder + ( zipDirectory !== '.' ? zipDirectory : '' )
	);
} );

zip.writeZip( `./${ name }.zip` );
stdout.write( `\nDone. \`${ name }.zip\` is ready! 🎉\n` );
