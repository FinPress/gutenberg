/**
 * External dependencies
 */
const path = require( 'path' );
const DefinePlugin = require( 'webpack' ).DefinePlugin;

/**
 * WordPress dependencies
 */
const postcssPlugins = require( '@wordpress/postcss-plugins-preset' );

const scssLoaders = ( { isLazy } ) => [
	{
		loader: 'style-loader',
		options: { injectType: isLazy ? 'lazyStyleTag' : 'styleTag' },
	},
	'css-loader',
	{
		loader: 'postcss-loader',
		options: {
			postcssOptions: {
				ident: 'postcss',
				plugins: postcssPlugins,
			},
		},
	},
	'sass-loader',
];

const stories = [
	process.env.NODE_ENV !== 'test' && './stories/**/*.story.@(js|tsx)',
	process.env.NODE_ENV !== 'test' && './stories/**/*.mdx',
	'../packages/block-editor/src/**/stories/*.story.@(js|tsx|mdx)',
	'../packages/components/src/**/stories/*.story.@(js|tsx)',
	'../packages/components/src/**/stories/*.mdx',
	'../packages/icons/src/**/stories/*.story.@(js|tsx|mdx)',
	'../packages/edit-site/src/**/stories/*.story.@(js|tsx|mdx)',
	'../packages/dataviews/src/**/stories/*.story.@(js|tsx|mdx)',
].filter( Boolean );

module.exports = {
	core: {
		disableTelemetry: true,
	},
	stories,
	staticDirs: [ './static' ],
	addons: [
		{
			name: '@storybook/addon-docs',
			options: { configureJSX: true },
		},
		'@storybook/addon-controls',
		'@storybook/addon-viewport',
		'@storybook/addon-a11y',
		'@storybook/addon-toolbars',
		'@storybook/addon-actions',
		'@storybook/addon-webpack5-compiler-babel',
		'storybook-addon-source-link',
		'@geometricpanda/storybook-addon-badges',
	],
	framework: {
		name: '@storybook/react-webpack5',
		options: {},
	},
	docs: {},
	typescript: {
		reactDocgen: 'react-docgen-typescript',
	},
	webpackFinal: async ( config ) => {
		return {
			...config,
			module: {
				...config.module,
				rules: [
					...config.module.rules,
					{
						test: /\/stories\/.+\.story\.(j|t)sx?$/,
						use: [
							{
								// Reads `tags` from the story metadata and copies them to `badges`
								loader: path.resolve(
									__dirname,
									'./webpack/copy-tags-to-badges.js'
								),
							},
						],
						enforce: 'post',
					},
					{
						test: /\.scss$/,
						exclude: /\.lazy\.scss$/,
						use: scssLoaders( { isLazy: false } ),
						include: path.resolve( __dirname ),
					},
					{
						test: /\.lazy\.scss$/,
						use: scssLoaders( { isLazy: true } ),
						include: path.resolve( __dirname ),
					},
				],
			},
			plugins: [
				...config.plugins,
				new DefinePlugin( {
					// Ensures that `@wordpress/warning` can properly detect dev mode.
					'globalThis.SCRIPT_DEBUG': JSON.stringify(
						process.env.NODE_ENV === 'development'
					),
				} ),
			],
		};
	},
};
