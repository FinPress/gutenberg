/**
 * External dependencies
 */
const { pascalCase, snakeCase } = require( 'change-case' );
const { join } = require( 'path' );

/**
 * Internal dependencies
 */
const initBlock = require( './init-block' );
const initPackageJSON = require( './init-package-json' );
const initWPScripts = require( './init-wp-scripts' );
const initWPEnv = require( './init-wp-env' );
const { code, info, success, error } = require( './log' );
const { writeOutputAsset, writeOutputTemplate } = require( './output' );
const { getOutputTemplates, getOutputAssets } = require( './templates' );

module.exports = async (
	{
		pluginOutputTemplates,
		themeOutputTemplates,
		blockOutputTemplates,
		outputAssets,
	},
	{
		$schema,
		apiVersion,
		type,
		plugin,
		theme,
		block,
		withBlocks,
		blockVariant,
		namespace,
		slug,
		title,
		description,
		dashicon,
		category,
		textdomain,
		attributes,
		supports,
		author,
		pluginURI,
		themeURI,
		license,
		licenseURI,
		domainPath,
		updateURI,
		version,
		requiresAtLeast,
		requiresWP,
		requiresPHP,
		testedUpTo,
		tags,
		wpScripts,
		wpEnv,
		npmDependencies,
		npmDevDependencies,
		customScripts,
		folderName,
		targetDir,
		editorScript,
		editorStyle,
		style,
		viewStyle,
		render,
		viewScriptModule,
		viewScript,
		variantVars,
		customPackageJSON,
		customBlockJSON,
		example,
		transformer,
		pluginTemplatesPath: variantPluginTemplatesPath,
		themeTemplatesPath: variantThemeTemplatesPath,
		blockTemplatesPath: variantBlockTemplatesPath,
		assetsPath: variantAssetsPath,
	}
) => {
	slug = slug.toLowerCase();
	const rootDirectory = join( process.cwd(), targetDir || slug );
	const transformedValues = transformer( {
		$schema,
		apiVersion,
		type,
		plugin,
		theme,
		block,
		withBlocks,
		blockVariant,
		namespace: namespace.toLowerCase(),
		slug,
		title,
		description,
		dashicon,
		category,
		attributes,
		supports,
		author,
		pluginURI,
		themeURI,
		license,
		licenseURI,
		domainPath,
		updateURI,
		version,
		requiresAtLeast,
		requiresWP,
		requiresPHP,
		testedUpTo,
		tags,
		wpScripts,
		wpEnv,
		npmDependencies,
		npmDevDependencies,
		customScripts,
		folderName: folderName
			? folderName.replace( /\$slug/g, slug )
			: './src',
		editorScript,
		editorStyle,
		style,
		viewStyle,
		render,
		viewScriptModule,
		viewScript,
		variantVars,
		customPackageJSON,
		customBlockJSON,
		example,
		textdomain: textdomain || slug,
		rootDirectory,
	} );

	const view = {
		...transformedValues,
		namespaceSnakeCase: snakeCase( transformedValues.namespace ),
		namespacePascalCase: pascalCase( transformedValues.namespace ),
		slugSnakeCase: snakeCase( transformedValues.slug ),
		slugPascalCase: pascalCase( transformedValues.slug ),
		isPluginProject: type === 'plugin',
		isThemeProject: type === 'theme',
		isBlockProject: type === 'block',
		// Add block variant flags for template conditionals
		isStaticBlock: blockVariant === 'static' || ! blockVariant,
		isDynamicBlock: blockVariant === 'dynamic',
		...variantVars,
	};

	// Check for the pluginTemplates path in the variant
	if ( variantPluginTemplatesPath === null ) {
		pluginOutputTemplates = {};
	} else if ( variantPluginTemplatesPath ) {
		pluginOutputTemplates = await getOutputTemplates(
			variantPluginTemplatesPath
		);
	}

	// Check for the themeTemplates path in the variant
	if ( variantThemeTemplatesPath === null ) {
		themeOutputTemplates = {};
	} else if ( variantThemeTemplatesPath ) {
		themeOutputTemplates = await getOutputTemplates(
			variantThemeTemplatesPath
		);
	}

	// Check for the blockTemplatesPath path in the variant
	if ( variantBlockTemplatesPath === null ) {
		blockOutputTemplates = {};
	} else if ( variantBlockTemplatesPath ) {
		blockOutputTemplates = await getOutputTemplates(
			variantBlockTemplatesPath
		);
	}

	// Check for the assetsPath
	if ( variantAssetsPath === null ) {
		outputAssets = {};
	} else if ( variantAssetsPath ) {
		outputAssets = await getOutputAssets( variantAssetsPath );
	}

	// Validate that we have the necessary templates for the project type
	if ( type === 'block' && Object.keys( blockOutputTemplates ) < 1 ) {
		error(
			'No block files found in the template. Please ensure that the template supports the blockTemplatesPath property.'
		);
		return;
	}

	if ( type === 'plugin' && Object.keys( pluginOutputTemplates ) < 1 ) {
		error(
			'No plugin files found in the template. Please ensure that the template supports the pluginTemplatesPath property.'
		);
		return;
	}

	if ( type === 'theme' && Object.keys( themeOutputTemplates ) < 1 ) {
		error(
			'No theme files found in the template. Please ensure that the template supports the themeTemplatesPath property.'
		);
		return;
	}

	// Determine if we need wpScripts based on project type and variant
	const needsWpScripts =
		wpScripts &&
		( type === 'plugin' ||
			( type === 'theme' &&
				( variantVars.isClassicVariant || withBlocks ) ) ||
			( type === 'block' && withBlocks ) );

	let projectTypeLabel = 'block';
	if ( type === 'plugin' ) {
		projectTypeLabel = 'plugin';
	}

	if ( type === 'theme' ) {
		projectTypeLabel = 'theme';
	}

	info( '' );
	info(
		`Creating a new WordPress ${ projectTypeLabel } in the ${ rootDirectory } directory.`
	);

	// Scaffold plugin files
	if ( type === 'plugin' ) {
		await Promise.all(
			Object.keys( pluginOutputTemplates ).map(
				async ( outputFile ) =>
					await writeOutputTemplate(
						pluginOutputTemplates[ outputFile ],
						outputFile,
						view
					)
			)
		);
	}

	// Scaffold theme files
	if ( type === 'theme' ) {
		await Promise.all(
			Object.keys( themeOutputTemplates ).map(
				async ( outputFile ) =>
					await writeOutputTemplate(
						themeOutputTemplates[ outputFile ],
						outputFile,
						view
					)
			)
		);
	}

	// Scaffold assets
	await Promise.all(
		Object.keys( outputAssets ).map(
			async ( outputFile ) =>
				await writeOutputAsset(
					outputAssets[ outputFile ],
					outputFile,
					view
				)
		)
	);

	// Scaffold blocks (for standalone blocks, or when withBlocks is true for plugins/themes)
	if ( type === 'block' || withBlocks ) {
		await initBlock( blockOutputTemplates, view );
	}

	// Initialize package.json for plugins and themes that need build process
	if (
		type === 'plugin' ||
		( type === 'theme' && ( variantVars.isClassicVariant || withBlocks ) )
	) {
		await initPackageJSON( view );

		if ( needsWpScripts ) {
			await initWPScripts( view );
		}

		if ( wpEnv ) {
			await initWPEnv( view );
		}
	}

	info( '' );

	success(
		`Done: WordPress ${ projectTypeLabel } ${ title } bootstrapped in the ${ rootDirectory } directory.`
	);

	// Show available commands and next steps
	if ( needsWpScripts ) {
		info( '' );
		info( 'You can run several commands inside:' );
		info( '' );
		code( '  $ npm start' );
		info( '    Starts the build for development.' );
		info( '' );
		code( '  $ npm run build' );
		info( '    Builds the code for production.' );
		info( '' );
		code( '  $ npm run format' );
		info( '    Formats files.' );
		info( '' );
		code( '  $ npm run lint:css' );
		info( '    Lints CSS files.' );
		info( '' );
		code( '  $ npm run lint:js' );
		info( '    Lints JavaScript files.' );
		info( '' );
		code( '  $ npm run plugin-zip' );
		info( '    Creates a zip file for a WordPress plugin.' );
		info( '' );
		code( '  $ npm run packages-update' );
		info( '    Updates WordPress packages to the latest version.' );
		info( '' );
		info( 'To enter the directory type:' );
		info( '' );
		code( `  $ cd ${ slug }` );
	}

	if ( needsWpScripts ) {
		info( '' );
		info( 'You can start development with:' );
		info( '' );
		code( '  $ npm start' );
	}

	if (
		wpEnv &&
		( type === 'plugin' ||
			( type === 'theme' &&
				( variantVars.isClassicVariant || withBlocks ) ) )
	) {
		info( '' );
		info( 'You can start WordPress with:' );
		info( '' );
		code( '  $ npx wp-env start' );
	}

	// Additional instructions for different project types
	if ( type === 'block' ) {
		info( '' );
		info( 'Your standalone block is ready!' );
		info( 'To use it in a plugin or theme:' );
		info( '1. Copy the block files to your plugin/theme directory' );
		info(
			'2. Register the block in your PHP file using register_block_type()'
		);
		info( '3. Enqueue the block assets' );
	}

	if ( type === 'theme' && ! variantVars.isClassicVariant && ! withBlocks ) {
		info( '' );
		info( 'Your FSE theme is ready!' );
		info( 'Key files:' );
		info( '- theme.json: Configure your theme settings' );
		info( '- templates/: Block template files' );
		info( '- parts/: Reusable template parts' );
	}

	if ( withBlocks && ( type === 'plugin' || type === 'theme' ) ) {
		info( '' );
		info( `Your ${ type } with blocks is ready!` );
		if ( type === 'theme' ) {
			info(
				'Make sure to activate the theme and enable Gutenberg features in functions.php'
			);
		}
	}

	info( '' );
	info( 'Code is Poetry' );
};
