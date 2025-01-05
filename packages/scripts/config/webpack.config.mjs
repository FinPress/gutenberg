/**
 * External dependencies
 */
// TODO: Remove this once https://nodejs.org/api/esm.html#importmetaresolvespecifier is stable.
import { createRequire } from 'module';
const require = createRequire( import.meta.url );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import webpack from 'webpack';
import browserslist from 'browserslist';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import { basename, dirname, relative, resolve, sep } from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import RtlCssPlugin from 'rtlcss-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { realpathSync } from 'fs';
import glob from 'fast-glob';

/**
 * WordPress dependencies
 */
import DependencyExtractionWebpackPlugin from '@wordpress/dependency-extraction-webpack-plugin';
import postcssPlugins from '@wordpress/postcss-plugins-preset';

/**
 * Internal dependencies
 */
import PhpFilePathsPlugin from '../plugins/php-file-paths-plugin/index.js';
import {
	fromConfigRoot,
	fromProjectRoot,
	hasBabelConfig,
	hasCssnanoConfig,
	hasPostCSSConfig,
	getProjectSourcePath,
	getWebpackEntryPoints,
	hasArgInCLI,
	getAsBooleanFromENV,
	getBlockJsonModuleFields,
	getBlockJsonScriptFields,
} from '../utils/index.js';

const isProduction = process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
let target = 'browserslist';
if ( ! browserslist.findConfig( '.' ) ) {
	target += ':' + fromConfigRoot( '.browserslistrc' );
}
const hasReactFastRefresh = hasArgInCLI( '--hot' ) && ! isProduction;
const hasExperimentalModulesFlag = getAsBooleanFromENV(
	'WP_EXPERIMENTAL_MODULES'
);

const cssLoaders = [
	{
		loader: MiniCSSExtractPlugin.loader,
	},
	{
		loader: require.resolve( 'css-loader' ),
		options: {
			importLoaders: 1,
			sourceMap: ! isProduction,
			modules: {
				auto: true,
			},
		},
	},
	{
		loader: require.resolve( 'postcss-loader' ),
		options: {
			// Provide a fallback configuration if there's not
			// one explicitly available in the project.
			...( ! hasPostCSSConfig() && {
				postcssOptions: {
					ident: 'postcss',
					sourceMap: ! isProduction,
					plugins: postcssPlugins,
				},
			} ),
		},
	},
];

/** @type {webpack.Configuration} */
const baseConfig = {
	mode,
	target,
	output: {
		filename: '[name].js',
		chunkFilename: '[name].js?ver=[chunkhash]',
		path: resolve( process.cwd(), 'build' ),
	},
	resolve: {
		alias: {
			'lodash-es': 'lodash',
		},
		extensions: [ '.jsx', '.ts', '.tsx', '...' ],
	},
	optimization: {
		// Only concatenate modules in production, when not analyzing bundles.
		concatenateModules: isProduction && ! process.env.WP_BUNDLE_ANALYZER,
		runtimeChunk: hasReactFastRefresh && 'single',
		splitChunks: {
			cacheGroups: {
				style: {
					type: 'css/mini-extract',
					test: /[\\/]style(\.module)?\.(pc|sc|sa|c)ss$/,
					chunks: 'all',
					enforce: true,
					name( _, chunks, cacheGroupKey ) {
						const chunkName = chunks[ 0 ].name;
						return `${ dirname(
							chunkName
						) }/${ cacheGroupKey }-${ basename( chunkName ) }`;
					},
				},
				default: false,
			},
		},
		minimizer: [
			new TerserPlugin( {
				parallel: true,
				terserOptions: {
					output: {
						comments: /translators:/i,
					},
					compress: {
						passes: 2,
					},
					mangle: {
						reserved: [ '__', '_n', '_nx', '_x' ],
					},
				},
				extractComments: false,
			} ),
			...( isProduction
				? [
						new CssMinimizerPlugin( {
							minimizerOptions: {
								preset: hasCssnanoConfig()
									? undefined
									: [
											'default',
											{
												discardComments: {
													removeAll: true,
												},
											},
									  ],
							},
						} ),
				  ]
				: [] ),
		],
	},
	module: {
		rules: [
			{
				test: /\.m?([jt])sx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: require.resolve( 'babel-loader' ),
						options: {
							// Babel uses a directory within local node_modules
							// by default. Use the environment variable option
							// to enable more persistent caching.
							cacheDirectory:
								process.env.BABEL_CACHE_DIRECTORY || true,

							// Provide a fallback configuration if there's not
							// one explicitly available in the project.
							...( ! hasBabelConfig() && {
								babelrc: false,
								configFile: false,
								presets: [
									require.resolve(
										'@wordpress/babel-preset-default'
									),
								],
								plugins: [
									hasReactFastRefresh &&
										require.resolve(
											'react-refresh/babel'
										),
								].filter( Boolean ),
							} ),
						},
					},
				],
			},
			{
				test: /\.css$/,
				use: cssLoaders,
			},
			{
				test: /\.pcss$/,
				use: cssLoaders,
			},
			{
				test: /\.(sc|sa)ss$/,
				use: [
					...cssLoaders,
					{
						loader: require.resolve( 'sass-loader' ),
						options: {
							sourceMap: ! isProduction,
						},
					},
				],
			},
			{
				test: /\.svg$/,
				issuer: /\.([jt])sx?$/,
				use: [
					'@svgr/webpack',
					{
						loader: 'asset/inline',
					},
				],
				type: 'javascript/auto',
			},
			{
				test: /\.svg$/,
				issuer: /\.(pc|sc|sa|c)ss$/,
				type: 'asset/inline',
			},
			{
				test: /\.(bmp|png|jpe?g|gif|webp)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'images/[name].[hash:8][ext]',
				},
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name].[hash:8][ext]',
				},
			},
		],
	},
	stats: {
		children: false,
	},
};

// WP_DEVTOOL global variable controls how source maps are generated.
// See: https://webpack.js.org/configuration/devtool/#devtool.
if ( process.env.WP_DEVTOOL ) {
	baseConfig.devtool = process.env.WP_DEVTOOL;
}

if ( ! isProduction ) {
	// Set default sourcemap mode if it wasn't set by WP_DEVTOOL.
	baseConfig.devtool = baseConfig.devtool || 'source-map';
}

// Add source-map-loader if devtool is set, whether in dev mode or not.
if ( baseConfig.devtool ) {
	baseConfig.module.rules.unshift( {
		test: /\.([jt])sx?$/,
		exclude: [ /node_modules/ ],
		use: require.resolve( 'source-map-loader' ),
		enforce: 'pre',
	} );
}

/** @type {webpack.Configuration} */
const scriptConfig = {
	...baseConfig,

	entry: getWebpackEntryPoints( 'script' ),

	devServer: isProduction
		? undefined
		: {
				devMiddleware: {
					writeToDisk: true,
				},
				allowedHosts: 'auto',
				host: 'localhost',
				port: 8887,
				proxy: {
					'/build': {
						pathRewrite: {
							'^/build': '',
						},
					},
				},
		  },

	plugins: [
		new webpack.DefinePlugin( {
			// Inject the `SCRIPT_DEBUG` global, used for development features flagging.
			'globalThis.SCRIPT_DEBUG': JSON.stringify( ! isProduction ),
			SCRIPT_DEBUG: JSON.stringify( ! isProduction ),
		} ),

		// If we run a modules build, the 2 compilations can "clean" each other's output
		// Prevent the cleaning from happening
		! hasExperimentalModulesFlag &&
			new CleanWebpackPlugin( {
				cleanAfterEveryBuildPatterns: [ '!fonts/**', '!images/**' ],
				// Prevent it from deleting webpack assets during builds that have
				// multiple configurations returned in the webpack config.
				cleanStaleWebpackAssets: false,
			} ),

		new PhpFilePathsPlugin( {
			context: getProjectSourcePath(),
			props: [ 'render', 'variations' ],
		} ),
		new CopyWebpackPlugin( {
			patterns: [
				{
					from: '**/block.json',
					context: getProjectSourcePath(),
					noErrorOnMissing: true,
					transform( content, absoluteFrom ) {
						const convertExtension = ( path ) => {
							return path.replace( /\.m?([jt])sx?$/, '.js' );
						};

						if ( basename( absoluteFrom ) === 'block.json' ) {
							const blockJson = JSON.parse( content.toString() );

							[
								getBlockJsonScriptFields( blockJson ),
								getBlockJsonModuleFields( blockJson ),
							].forEach( ( fields ) => {
								if ( fields ) {
									for ( const [
										key,
										value,
									] of Object.entries( fields ) ) {
										if ( Array.isArray( value ) ) {
											blockJson[ key ] =
												value.map( convertExtension );
										} else if (
											typeof value === 'string'
										) {
											blockJson[ key ] =
												convertExtension( value );
										}
									}
								}
							} );

							if ( hasReactFastRefresh ) {
								// Prepends the file reference to the shared runtime chunk to every script type defined for the block.
								const runtimePath = relative(
									dirname( absoluteFrom ),
									fromProjectRoot(
										getProjectSourcePath() +
											sep +
											'runtime.js'
									)
								);
								const fields =
									getBlockJsonScriptFields( blockJson );
								for ( const [ fieldName ] of Object.entries(
									fields
								) ) {
									blockJson[ fieldName ] = [
										`file:${ runtimePath }`,
										...( Array.isArray(
											blockJson[ fieldName ]
										)
											? blockJson[ fieldName ]
											: [ blockJson[ fieldName ] ] ),
									];
								}
							}

							return JSON.stringify( blockJson, null, 2 );
						}

						return content;
					},
				},
				{
					from: '**/*.php',
					context: getProjectSourcePath(),
					noErrorOnMissing: true,
					filter: ( filepath ) => {
						return (
							process.env.WP_COPY_PHP_FILES_TO_DIST ||
							PhpFilePathsPlugin.paths.includes(
								realpathSync( filepath ).replace( /\\/g, '/' )
							)
						);
					},
				},
			],
		} ),
		// The WP_BUNDLE_ANALYZER global variable enables a utility that represents
		// bundle content as a convenient interactive zoomable treemap.
		process.env.WP_BUNDLE_ANALYZER && new BundleAnalyzerPlugin(),
		// MiniCSSExtractPlugin to extract the CSS thats gets imported into JavaScript.
		new MiniCSSExtractPlugin( {
			filename: '[name].css',
		} ),
		// RtlCssPlugin to generate RTL CSS files.
		new RtlCssPlugin( '[name]-rtl.css' ),
		// React Fast Refresh.
		hasReactFastRefresh && new ReactRefreshWebpackPlugin(),
		// WP_NO_EXTERNALS global variable controls whether scripts' assets get
		// generated, and the default externals set.
		! process.env.WP_NO_EXTERNALS &&
			new DependencyExtractionWebpackPlugin(),
	].filter( Boolean ),
};

let config;

if ( hasExperimentalModulesFlag ) {
	/**
	 * Add block.json files to compilation to ensure changes trigger rebuilds when watching
	 */
	class BlockJsonDependenciesPlugin {
		constructor() {
			this.blockJsonFiles = glob.sync( '**/block.json', {
				absolute: true,
				cwd: fromProjectRoot( getProjectSourcePath() ),
			} );
		}

		/**
		 * Apply the plugin
		 * @param {webpack.Compiler} compiler the compiler instance
		 * @return {void}
		 */
		apply( compiler ) {
			if ( this.blockJsonFiles.length ) {
				compiler.hooks.compilation.tap(
					'BlockJsonDependenciesPlugin',
					( compilation ) => {
						compilation.fileDependencies.addAll(
							this.blockJsonFiles
						);
					}
				);
			}
		}
	}

	/** @type {webpack.Configuration} */
	const moduleConfig = {
		...baseConfig,

		entry: getWebpackEntryPoints( 'module' ),

		experiments: {
			...baseConfig.experiments,
			outputModule: true,
		},

		output: {
			...baseConfig.output,
			module: true,
			chunkFormat: 'module',
			environment: {
				...baseConfig.output.environment,
				module: true,
			},
			library: {
				...baseConfig.output.library,
				type: 'module',
			},
		},

		plugins: [
			new webpack.DefinePlugin( {
				// Inject the `SCRIPT_DEBUG` global, used for development features flagging.
				'globalThis.SCRIPT_DEBUG': JSON.stringify( ! isProduction ),
				SCRIPT_DEBUG: JSON.stringify( ! isProduction ),
			} ),
			// The WP_BUNDLE_ANALYZER global variable enables a utility that represents
			// bundle content as a convenient interactive zoomable treemap.
			process.env.WP_BUNDLE_ANALYZER && new BundleAnalyzerPlugin(),
			// MiniCSSExtractPlugin to extract the CSS thats gets imported into JavaScript.
			new MiniCSSExtractPlugin( { filename: '[name].css' } ),
			// WP_NO_EXTERNALS global variable controls whether scripts' assets get
			// generated, and the default externals set.
			! process.env.WP_NO_EXTERNALS &&
				new DependencyExtractionWebpackPlugin(),
			new BlockJsonDependenciesPlugin(),
		].filter( Boolean ),
	};

	config = [ scriptConfig, moduleConfig ];
} else {
	config = scriptConfig;
}

export default config;
