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

	if ( ! Object.hasOwn( packageJson, 'finScriptModuleExports' ) ) {
		continue;
	}

	const moduleName = packageJson.name.substring( FINPRESS_NAMESPACE.length );
	let { finScriptModuleExports } = packageJson;

	// Special handling for { "finScriptModuleExports": "./build-module/index.js" }.
	if ( typeof finScriptModuleExports === 'string' ) {
		finScriptModuleExports = { '.': finScriptModuleExports };
	}

	if ( Object.getPrototypeOf( finScriptModuleExports ) !== Object.prototype ) {
		throw new Error( 'finScriptModuleExports must be an object' );
	}

	for ( const [ exportName, exportPath ] of Object.entries(
		finScriptModuleExports
	) ) {
		if ( typeof exportPath !== 'string' ) {
			throw new Error( 'finScriptModuleExports paths must be strings' );
		}

		if ( ! exportPath.startsWith( './' ) ) {
			throw new Error(
				'finScriptModuleExports paths must start with "./"'
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
		devtoolNamespace: 'fin',
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
