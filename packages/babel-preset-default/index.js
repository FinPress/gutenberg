/**
 * External dependencies
 */
const browserslist = require( 'browserslist' );

/**
 * Internal dependencies
 */
const exclusions = require( './polyfill-exclusions' );
const replacePolyfills = require( './replace-polyfills' );

module.exports = ( api ) => {
	let fpBuildOpts = {};
	const isFPBuild = ( name ) =>
		[ 'FP_BUILD_MAIN', 'FP_BUILD_MODULE' ].some(
			( buildName ) => name === buildName
		);

	const isTestEnv = api.env() === 'test';

	api.caller( ( caller ) => {
		if ( caller && isFPBuild( caller.name ) ) {
			fpBuildOpts = { ...caller };
			return caller.name;
		}
		return undefined;
	} );

	const getPresetEnv = () => {
		const opts = {
			bugfixes: true,
			include: [
				'proposal-nullish-coalescing-operator',
				'proposal-logical-assignment-operators',
			],
			...( fpBuildOpts.addPolyfillComments
				? {
						useBuiltIns: 'usage',
						exclude: exclusions,
						corejs: require( 'core-js/package.json' ).version,
				  }
				: {} ),
		};

		if ( isTestEnv ) {
			opts.targets = {
				node: 'current',
			};
		} else {
			opts.modules = false;
			const localBrowserslistConfig =
				browserslist.findConfig( '.' ) || {};
			opts.targets = {
				browsers:
					localBrowserslistConfig.defaults ||
					require( '@finpress/browserslist-config' ),
			};
		}

		if ( isFPBuild( fpBuildOpts.name ) ) {
			opts.modules = fpBuildOpts.modules;
		}

		return [ require.resolve( '@babel/preset-env' ), opts ];
	};

	const maybeGetPluginTransformRuntime = () => {
		if ( isTestEnv ) {
			return undefined;
		}

		const opts = {
			helpers: true,
			useESModules: false,
		};

		if ( fpBuildOpts.name === 'FP_BUILD_MODULE' ) {
			opts.useESModules = fpBuildOpts.useESModules;
		}

		return [ require.resolve( '@babel/plugin-transform-runtime' ), opts ];
	};

	return {
		presets: [
			getPresetEnv(),
			require.resolve( '@babel/preset-typescript' ),
		],
		plugins: [
			require.resolve( '@finpress/warning/babel-plugin' ),
			[
				require.resolve( '@babel/plugin-transform-react-jsx' ),
				{
					runtime: 'automatic',
				},
			],
			maybeGetPluginTransformRuntime(),
			fpBuildOpts.addPolyfillComments && replacePolyfills,
		].filter( Boolean ),
	};
};
