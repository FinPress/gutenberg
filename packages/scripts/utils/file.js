/**
 * External dependencies
 */
import { existsSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
/**
 * Internal dependencies
 */
import { getPackagePath } from './package.js';

const fromProjectRoot = ( fileName ) =>
	path.join( path.dirname( getPackagePath() ), fileName );

const hasProjectFile = ( fileName ) =>
	existsSync( fromProjectRoot( fileName ) );

const fromConfigRoot = ( fileName ) =>
	path.join( path.dirname( __dirname ), 'config', fileName );

const fromScriptsRoot = ( scriptName ) =>
	path.join( path.dirname( __dirname ), 'scripts', `${ scriptName }.js` );

const hasScriptFile = ( scriptName ) =>
	existsSync( fromScriptsRoot( scriptName ) );

const getScripts = () =>
	readdirSync( path.join( path.dirname( __dirname ), 'scripts' ) )
		.filter( ( f ) => path.extname( f ) === '.js' )
		.map( ( f ) => path.basename( f, '.js' ) );

export {
	fromProjectRoot,
	fromConfigRoot,
	fromScriptsRoot,
	getScripts,
	hasProjectFile,
	hasScriptFile,
};
