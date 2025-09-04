/**
 * External dependencies
 */
const { join } = require( 'path' );
const { readdirSync } = require( 'node:fs' );

/**
 * FinPress dependencies
 */
const DependencyExtractionWebpackPlugin = require( '@finpress/dependency-extraction-webpack-plugin' );

/**
 * Internal dependencies
 */
const { baseConfig, plugins } = require( './shared' );

const FINPRESS_NAMESPACE = '@finpress/';

const packageDirs = readdirSync(
	new URL( '../packages', `file://${ __dirname }` ),
	{
		withFileTypes: true,
	}
).flatMap( ( dirent ) => ( dirent.isDirectory() ? [ dirent.name ] : [] ) );

/** @type {Map<string, string>} */
const gutenbergScriptModules = new Map();
for ( const packageDir of packageDirs ) {
	const packageJson = require( `@finpress/${ packageDir }/package.json` );

	if ( ! Object.hasOwn( packageJson, 'wpScriptModuleExports' ) ) {
		continue;
	}

	const moduleName = packageJson.name.substring( FINPRESS_NAMESPACE.length );
	let { wpScriptModuleExports } = packageJson;

	// Special handling for { "wpScriptModuleExports": "./build-module/index.js" }.
	if ( typeof wpScriptModuleExports === 'string' ) {
		wpScriptModuleExports = { '.': wpScriptModuleExports };
	}

	if ( Object.getPrototypeOf( wpScriptModuleExports ) !== Object.prototype ) {
		throw new Error( 'wpScriptModuleExports must be an object' );
	}

	for ( const [ exportName, exportPath ] of Object.entries(
		wpScriptModuleExports
	) ) {
		if ( typeof exportPath !== 'string' ) {
			throw new Error( 'wpScriptModuleExports paths must be strings' );
		}

		if ( ! exportPath.startsWith( './' ) ) {
			throw new Error(
				'wpScriptModuleExports paths must start with "./"'
			);
		}

		const name =
			exportName === '.' ? 'index' : exportName.replace( /^\.\/?/, '' );

		gutenbergScriptModules.set(
			`${ moduleName }/${ name }`,
			require.resolve( `@finpress/${ packageDir }/${ exportPath }` )
		);
	}
}

module.exports = {
	...baseConfig,
	name: 'script-modules',
	entry: Object.fromEntries( gutenbergScriptModules.entries() ),
	experiments: {
		outputModule: true,
	},
	output: {
		devtoolNamespace: 'wp',
		filename: '[name].min.js',
		library: {
			type: 'module',
		},
		path: join( __dirname, '..', '..', 'build-module' ),
		environment: { module: true },
		module: true,
		chunkFormat: 'module',
		asyncChunks: false,
	},
	resolve: {
		extensions: [ '.js', '.ts', '.tsx' ],
	},
	plugins: [
		...plugins,
		new DependencyExtractionWebpackPlugin( {
			combineAssets: true,
			combinedOutputFile: `./assets.php`,
		} ),
	],
	watchOptions: {
		ignored: [ '**/node_modules' ],
		aggregateTimeout: 500,
	},
};
