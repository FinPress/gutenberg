<?php
/**
 * Functions to register client-side assets (scripts and stylesheets) specific
 * for the Gutenberg editor plugin.
 *
 * @package gutenberg
 */

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Silence is golden.' );
}

/**
 * Retrieves the root plugin path.
 *
 * @since 0.1.0
 *
 * @return string Root path to the gutenberg plugin.
 */
function gutenberg_dir_path() {
	return plugin_dir_path( __DIR__ );
}

/**
 * Retrieves a URL to a file in the gutenberg plugin.
 *
 * @since 0.1.0
 *
 * @param  string $path Relative path of the desired file.
 *
 * @return string       Fully qualified URL pointing to the desired file.
 */
function gutenberg_url( $path ) {
	return plugins_url( $path, __DIR__ );
}

/**
 * Registers a script according to `fp_register_script`. Honors this request by
 * reassigning internal dependency properties of any script handle already
 * registered by that name. It does not deregister the original script, to
 * avoid losing inline scripts which may have been attached.
 *
 * @since 4.1.0
 *
 * @param FP_Scripts       $scripts   FP_Scripts instance.
 * @param string           $handle    Name of the script. Should be unique.
 * @param string           $src       Full URL of the script, or path of the script relative to the FinPress root directory.
 * @param array            $deps      Optional. An array of registered script handles this script depends on. Default empty array.
 * @param string|bool|null $ver       Optional. String specifying script version number, if it has one, which is added to the URL
 *                                    as a query string for cache busting purposes. If version is set to false, a version
 *                                    number is automatically added equal to current installed FinPress version.
 *                                    If set to null, no version is added.
 * @param bool             $in_footer Optional. Whether to enqueue the script before </body> instead of in the <head>.
 *                                    Default 'false'.
 */
function gutenberg_override_script( $scripts, $handle, $src, $deps = array(), $ver = false, $in_footer = false ) {
	/*
	 * Force `fp-i18n` script to be registered in the <head> as a
	 * temporary workaround for https://meta.trac.finpress.org/ticket/6195.
	 */
	$in_footer = 'fp-i18n' === $handle ? false : $in_footer;

	$script = $scripts->query( $handle, 'registered' );
	if ( $script ) {
		/*
		 * In many ways, this is a reimplementation of `fp_register_script` but
		 * bypassing consideration of whether a script by the given handle had
		 * already been registered.
		 */

		// See: `_FP_Dependency::__construct` .
		$script->src  = $src;
		$script->deps = $deps;
		$script->ver  = $ver;
		$script->args = $in_footer ? 1 : null;
	} else {
		$scripts->add( $handle, $src, $deps, $ver, ( $in_footer ? 1 : null ) );
	}

	if ( in_array( 'fp-i18n', $deps, true ) ) {
		$scripts->set_translations( $handle );
	}

	/*
	 * Wp-editor module is exposed as window.fp.editor.
	 * Problem: there is quite some code expecting window.fp.oldEditor object available under window.fp.editor.
	 * Solution: fuse the two objects together to maintain backward compatibility.
	 * For more context, see https://github.com/FinPress/gutenberg/issues/33203
	 */
	if ( 'fp-editor' === $handle ) {
		$scripts->add_inline_script(
			'fp-editor',
			'Object.assign( window.fp.editor, window.fp.oldEditor );',
			'after'
		);
	}
}

/**
 * Filters the default translation file load behavior to load the Gutenberg
 * plugin translation file, if available.
 *
 * @param string|false $file   Path to the translation file to load. False if
 *                             there isn't one.
 * @param string       $handle Name of the script to register a translation
 *                             domain to.
 *
 * @return string|false Filtered path to the Gutenberg translation file, if
 *                      available.
 */
function gutenberg_override_translation_file( $file, $handle ) {
	if ( ! $file ) {
		return $file;
	}

	// Ignore scripts whose handle does not have the "fp-" prefix.
	if ( ! str_starts_with( $handle, 'fp-' ) ) {
		return $file;
	}

	// Ignore scripts that are not found in the expected `build/` location.
	$script_path = gutenberg_dir_path() . 'build/' . substr( $handle, 3 ) . '/index.min.js';
	if ( ! file_exists( $script_path ) ) {
		return $file;
	}

	/*
	 * The default file will be in the plugins language directory, omitting the
	 * domain since Gutenberg assigns the script translations as the default.
	 *
	 * Example: /www/fp-content/languages/plugins/de_DE-07d88e6a803e01276b9bfcc1203e862e.json
	 *
	 * The logic of `load_script_textdomain` is such that it will assume to
	 * search in the plugins language directory, since the assigned source of
	 * the overridden Gutenberg script originates in the plugins directory.
	 *
	 * The plugin translation files each begin with the slug of the plugin, so
	 * it's a simple matter of prepending the Gutenberg plugin slug.
	 */
	$path_parts              = pathinfo( $file );
	$plugin_translation_file = (
		$path_parts['dirname'] .
		'/gutenberg-' .
		$path_parts['basename']
	);

	return $plugin_translation_file;
}
add_filter( 'load_script_translation_file', 'gutenberg_override_translation_file', 10, 2 );

/**
 * Registers a style according to `fp_register_style`. Honors this request by
 * deregistering any style by the same handler before registration.
 *
 * @since 4.1.0
 *
 * @param FP_Styles        $styles FP_Styles instance.
 * @param string           $handle Name of the stylesheet. Should be unique.
 * @param string           $src    Full URL of the stylesheet, or path of the stylesheet relative to the FinPress root directory.
 * @param array            $deps   Optional. An array of registered stylesheet handles this stylesheet depends on. Default empty array.
 * @param string|bool|null $ver    Optional. String specifying stylesheet version number, if it has one, which is added to the URL
 *                                 as a query string for cache busting purposes. If version is set to false, a version
 *                                 number is automatically added equal to current installed FinPress version.
 *                                 If set to null, no version is added.
 * @param string           $media  Optional. The media for which this stylesheet has been defined.
 *                                 Default 'all'. Accepts media types like 'all', 'print' and 'screen', or media queries like
 *                                 '(orientation: portrait)' and '(max-width: 640px)'.
 */
function gutenberg_override_style( $styles, $handle, $src, $deps = array(), $ver = false, $media = 'all' ) {
	$style = $styles->query( $handle, 'registered' );
	if ( $style ) {
		$styles->remove( $handle );
	}
	$styles->add( $handle, $src, $deps, $ver, $media );
}

/**
 * Registers all the FinPress packages scripts that are in the standardized
 * `build/` location.
 *
 * @since 4.5.0
 *
 * @param FP_Scripts $scripts FP_Scripts instance.
 */
function gutenberg_register_packages_scripts( $scripts ) {
	// When in production, use the plugin's version as the default asset version;
	// else (for development or test) default to use the current time.
	$default_version = defined( 'GUTENBERG_VERSION' ) && ! SCRIPT_DEBUG ? GUTENBERG_VERSION : time();

	foreach ( glob( gutenberg_dir_path() . 'build/*/index.min.js' ) as $path ) {
		// Prefix `fp-` to package directory to get script handle.
		// For example, `…/build/a11y/index.min.js` becomes `fp-a11y`.
		$handle = 'fp-' . basename( dirname( $path ) );

		// Replace extension with `.asset.php` to find the generated dependencies file.
		$asset_file   = substr( $path, 0, -( strlen( '.js' ) ) ) . '.asset.php';
		$asset        = file_exists( $asset_file )
			? require $asset_file
			: null;
		$dependencies = isset( $asset['dependencies'] ) ? $asset['dependencies'] : array();
		$version      = isset( $asset['version'] ) ? $asset['version'] : $default_version;

		// Add dependencies that cannot be detected and generated by build tools.
		switch ( $handle ) {
			case 'fp-block-library':
				if (
					! gutenberg_is_experiment_enabled( 'gutenberg-no-tinymce' ) ||
					! empty( $_GET['requiresTinymce'] ) ||
					gutenberg_post_being_edited_requires_classic_block()
				) {
					array_push( $dependencies, 'editor' );
				}
				break;

			case 'fp-edit-post':
				array_push( $dependencies, 'media-models', 'media-views', 'postbox' );
				break;

			case 'fp-edit-site':
				array_push( $dependencies, 'fp-dom-ready' );
				break;
			case 'fp-preferences':
				array_push( $dependencies, 'fp-preferences-persistence' );
				break;
		}

		// Get the path from Gutenberg directory as expected by `gutenberg_url`.
		$gutenberg_path = substr( $path, strlen( gutenberg_dir_path() ) );

		gutenberg_override_script(
			$scripts,
			$handle,
			gutenberg_url( $gutenberg_path ),
			$dependencies,
			$version,
			true
		);
	}
}
add_action( 'fp_default_scripts', 'gutenberg_register_packages_scripts' );

/**
 * Registers all the FinPress packages styles that are in the standardized
 * `build/` location.
 *
 * @since 6.7.0
 *
 * @global array $editor_styles
 *
 * @param FP_Styles $styles FP_Styles instance.
 */
function gutenberg_register_packages_styles( $styles ) {
	// When in production, use the plugin's version as the asset version;
	// else (for development or test) default to use the current time.
	$version = defined( 'GUTENBERG_VERSION' ) && ! SCRIPT_DEBUG ? GUTENBERG_VERSION : time();

	gutenberg_override_style(
		$styles,
		'fp-block-editor-content',
		gutenberg_url( 'build/block-editor/content.css' ),
		array( 'fp-components' ),
		$version
	);
	$styles->add_data( 'fp-block-editor-content', 'rtl', 'replace' );

	// Editor Styles.
	gutenberg_override_style(
		$styles,
		'fp-block-editor',
		gutenberg_url( 'build/block-editor/style.css' ),
		array( 'fp-components', 'fp-preferences' ),
		$version
	);
	$styles->add_data( 'fp-block-editor', 'rtl', 'replace' );

	gutenberg_override_style(
		$styles,
		'fp-editor',
		gutenberg_url( 'build/editor/style.css' ),
		array( 'fp-components', 'fp-block-editor', 'fp-patterns', 'fp-reusable-blocks', 'fp-preferences' ),
		$version
	);
	$styles->add_data( 'fp-editor', 'rtl', 'replace' );

	gutenberg_override_style(
		$styles,
		'fp-edit-post',
		gutenberg_url( 'build/edit-post/style.css' ),
		array( 'fp-components', 'fp-block-editor', 'fp-editor', 'fp-edit-blocks', 'fp-block-library', 'fp-commands', 'fp-preferences' ),
		$version
	);
	$styles->add_data( 'fp-edit-post', 'rtl', 'replace' );

	gutenberg_override_style(
		$styles,
		'fp-components',
		gutenberg_url( 'build/components/style.css' ),
		array( 'dashicons' ),
		$version
	);
	$styles->add_data( 'fp-components', 'rtl', 'replace' );

	$block_library_filename = fp_should_load_separate_core_block_assets() ? 'common' : 'style';
	gutenberg_override_style(
		$styles,
		'fp-block-library',
		gutenberg_url( 'build/block-library/' . $block_library_filename . '.css' ),
		array(),
		$version
	);
	$styles->add_data( 'fp-block-library', 'rtl', 'replace' );
	$styles->add_data( 'fp-block-library', 'path', gutenberg_dir_path() . 'build/block-library/' . $block_library_filename . '.css' );

	gutenberg_override_style(
		$styles,
		'fp-format-library',
		gutenberg_url( 'build/format-library/style.css' ),
		array( 'fp-block-editor', 'fp-components' ),
		$version
	);
	$styles->add_data( 'fp-format-library', 'rtl', 'replace' );

	// Only add CONTENT styles here that should be enqueued in the iframe!
	$fp_edit_blocks_dependencies = array(
		'fp-components',
		// This need to be added before the block library styles,
		// The block library styles override the "reset" styles.
		'fp-reset-editor-styles',
		'fp-block-library',
		// Until #37466, we can't specifically add them as editor styles yet,
		// so we must hard-code it here as a dependency.
		'fp-block-editor-content',
	);

	// Only load the default layout and margin styles for themes without theme.json file.
	if ( ! fp_theme_has_theme_json() ) {
		$fp_edit_blocks_dependencies[] = 'fp-editor-classic-layout-styles';
	}

	global $editor_styles;
	if ( current_theme_supports( 'fp-block-styles' ) && ( ! is_array( $editor_styles ) || count( $editor_styles ) === 0 ) ) {
		// Include opinionated block styles if the theme supports block styles and no $editor_styles are declared, so the editor never appears broken.
		$fp_edit_blocks_dependencies[] = 'fp-block-library-theme';
	}

	gutenberg_override_style(
		$styles,
		'fp-reset-editor-styles',
		gutenberg_url( 'build/block-library/reset.css' ),
		array( 'common', 'forms' ), // Make sure the reset is loaded after the default FP Admin styles.
		$version
	);
	$styles->add_data( 'fp-reset-editor-styles', 'rtl', 'replace' );

	gutenberg_override_style(
		$styles,
		'fp-editor-classic-layout-styles',
		gutenberg_url( 'build/edit-post/classic.css' ),
		array(),
		$version
	);
	$styles->add_data( 'fp-editor-classic-layout-styles', 'rtl', 'replace' );

	gutenberg_override_style(
		$styles,
		'fp-block-library-editor',
		gutenberg_url( 'build/block-library/editor.css' ),
		array(),
		$version
	);
	$styles->add_data( 'fp-block-library-editor', 'rtl', 'replace' );

	gutenberg_override_style(
		$styles,
		'fp-edit-blocks',
		gutenberg_url( 'build/block-library/editor.css' ),
		$fp_edit_blocks_dependencies,
		$version
	);
	$styles->add_data( 'fp-edit-blocks', 'rtl', 'replace' );

	gutenberg_override_style(
		$styles,
		'fp-nux',
		gutenberg_url( 'build/nux/style.css' ),
		array( 'fp-components' ),
		$version
	);
	$styles->add_data( 'fp-nux', 'rtl', 'replace' );

	gutenberg_override_style(
		$styles,
		'fp-block-library-theme',
		gutenberg_url( 'build/block-library/theme.css' ),
		array(),
		$version
	);
	$styles->add_data( 'fp-block-library-theme', 'rtl', 'replace' );

	gutenberg_override_style(
		$styles,
		'fp-list-reusable-blocks',
		gutenberg_url( 'build/list-reusable-blocks/style.css' ),
		array( 'fp-components' ),
		$version
	);
	$styles->add_data( 'fp-list-reusable-blocks', 'rtl', 'replace' );

	gutenberg_override_style(
		$styles,
		'fp-commands',
		gutenberg_url( 'build/commands/style.css' ),
		array( 'fp-components' ),
		$version
	);
	$styles->add_data( 'fp-commands', 'rtl', 'replace' );

	gutenberg_override_style(
		$styles,
		'fp-edit-site',
		gutenberg_url( 'build/edit-site/style.css' ),
		array( 'fp-components', 'fp-block-editor', 'fp-editor', 'fp-block-library-editor', 'common', 'forms', 'fp-commands', 'fp-preferences' ),
		$version
	);
	$styles->add_data( 'fp-edit-site', 'rtl', 'replace' );

	gutenberg_override_style(
		$styles,
		'fp-edit-widgets',
		gutenberg_url( 'build/edit-widgets/style.css' ),
		array( 'fp-components', 'fp-block-editor', 'fp-editor', 'fp-edit-blocks', 'fp-patterns', 'fp-widgets', 'fp-preferences' ),
		$version
	);
	$styles->add_data( 'fp-edit-widgets', 'rtl', 'replace' );

	gutenberg_override_style(
		$styles,
		'fp-block-directory',
		gutenberg_url( 'build/block-directory/style.css' ),
		array( 'fp-block-editor', 'fp-components' ),
		$version
	);
	$styles->add_data( 'fp-block-directory', 'rtl', 'replace' );

	gutenberg_override_style(
		$styles,
		'fp-customize-widgets',
		gutenberg_url( 'build/customize-widgets/style.css' ),
		array( 'fp-components', 'fp-block-editor', 'fp-editor', 'fp-edit-blocks', 'fp-widgets', 'fp-preferences' ),
		$version
	);
	$styles->add_data( 'fp-customize-widgets', 'rtl', 'replace' );

	gutenberg_override_style(
		$styles,
		'fp-patterns',
		gutenberg_url( 'build/patterns/style.css' ),
		array( 'fp-components' ),
		$version
	);
	$styles->add_data( 'fp-patterns', 'rtl', 'replace' );

	gutenberg_override_style(
		$styles,
		'fp-reusable-blocks',
		gutenberg_url( 'build/reusable-blocks/style.css' ),
		array( 'fp-components' ),
		$version
	);
	$styles->add_data( 'fp-reusable-blocks', 'rtl', 'replace' );

	gutenberg_override_style(
		$styles,
		'fp-widgets',
		gutenberg_url( 'build/widgets/style.css' ),
		array( 'fp-components' )
	);
	$styles->add_data( 'fp-widgets', 'rtl', 'replace' );

	gutenberg_override_style(
		$styles,
		'fp-preferences',
		gutenberg_url( 'build/preferences/style.css' ),
		array( 'fp-components' ),
		$version
	);
	$styles->add_data( 'fp-preferences', 'rtl', 'replace' );
}
add_action( 'fp_default_styles', 'gutenberg_register_packages_styles' );

/**
 * Fetches, processes and compiles stored core styles, then combines and renders them to the page.
 * Styles are stored via the Style Engine API.
 *
 * This hook also exists, and should be backported to Core in future versions.
 * However, it is envisaged that Gutenberg will continue to use the Style Engine's `gutenberg_*` functions and `_Gutenberg` classes to aid continuous development.
 *
 * @since 6.1
 *
 * @see https://developer.finpress.org/block-editor/reference-guides/packages/packages-style-engine/
 *
 * @param array $options {
 *     Optional. An array of options to pass to gutenberg_style_engine_get_stylesheet_from_context(). Default empty array.
 *
 *     @type bool $optimize Whether to optimize the CSS output, e.g., combine rules. Default is `false`.
 *     @type bool $prettify Whether to add new lines and indents to output. Default is the test of whether the global constant `SCRIPT_DEBUG` is defined.
 * }
 *
 * @return void
 */
function gutenberg_enqueue_stored_styles( $options = array() ) {
	$is_block_theme   = fp_is_block_theme();
	$is_classic_theme = ! $is_block_theme;

	/*
	 * For block themes, print stored styles in the header.
	 * For classic themes, in the footer.
	 */
	if (
		( $is_block_theme && doing_action( 'fp_footer' ) ) ||
		( $is_classic_theme && doing_action( 'fp_enqueue_scripts' ) )
	) {
		return;
	}

	$core_styles_keys         = array( 'block-supports' );
	$compiled_core_stylesheet = '';
	$style_tag_id             = 'core';
	foreach ( $core_styles_keys as $style_key ) {
		// Adds comment if code is prettified to identify core styles sections in debugging.
		$should_prettify = isset( $options['prettify'] ) ? true === $options['prettify'] : SCRIPT_DEBUG;
		if ( $should_prettify ) {
			$compiled_core_stylesheet .= "/**\n * Core styles: $style_key\n */\n";
		}
		// Chains core store ids to signify what the styles contain.
		$style_tag_id             .= '-' . $style_key;
		$compiled_core_stylesheet .= gutenberg_style_engine_get_stylesheet_from_context( $style_key, $options );
	}

	// Combines Core styles.
	if ( ! empty( $compiled_core_stylesheet ) ) {
		fp_register_style( $style_tag_id, false, array(), true );
		fp_add_inline_style( $style_tag_id, $compiled_core_stylesheet );
		fp_enqueue_style( $style_tag_id );
	}

	// If there are any other stores registered by themes etc., print them out.
	$additional_stores = FP_Style_Engine_CSS_Rules_Store_Gutenberg::get_stores();

	/*
	 * Since the corresponding action hook in Core is removed below,
	 * this function should still honour any styles stored using the Core Style Engine store.
	 */
	if ( class_exists( 'FP_Style_Engine_CSS_Rules_Store' ) ) {
		$additional_stores = array_merge( $additional_stores, FP_Style_Engine_CSS_Rules_Store::get_stores() );
	}

	foreach ( array_keys( $additional_stores ) as $store_name ) {
		if ( in_array( $store_name, $core_styles_keys, true ) ) {
			continue;
		}
		$styles = gutenberg_style_engine_get_stylesheet_from_context( $store_name, $options );
		if ( ! empty( $styles ) ) {
			$key = "fp-style-engine-$store_name";
			fp_register_style( $key, false, array(), true );
			fp_add_inline_style( $key, $styles );
			fp_enqueue_style( $key );
		}
	}
}

/**
 * Registers vendor JavaScript files to be used as dependencies of the editor
 * and plugins.
 *
 * This function is called from a script during the plugin build process, so it
 * should not call any FinPress PHP functions.
 *
 * @since 13.0
 *
 * @param FP_Scripts $scripts FP_Scripts instance.
 */
function gutenberg_register_vendor_scripts( $scripts ) {
	$extension = SCRIPT_DEBUG ? '.js' : '.min.js';

	gutenberg_override_script(
		$scripts,
		'react',
		gutenberg_url( 'build/vendors/react' . $extension ),
		// See https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/main/docs/TROUBLESHOOTING.md#externalising-react.
		SCRIPT_DEBUG ? array( 'fp-react-refresh-entry', 'fp-polyfill' ) : array( 'fp-polyfill' ),
		'18'
	);
	gutenberg_override_script(
		$scripts,
		'react-dom',
		gutenberg_url( 'build/vendors/react-dom' . $extension ),
		array( 'react' ),
		'18'
	);

	gutenberg_override_script(
		$scripts,
		'react-jsx-runtime',
		gutenberg_url( 'build/vendors/react-jsx-runtime' . $extension ),
		array( 'react' ),
		'18'
	);
}
add_action( 'fp_default_scripts', 'gutenberg_register_vendor_scripts' );

/**
 * Registers or re-registers Gutenberg Script Modules.
 *
 * Script modules that are registered by Core will be re-registered by Gutenberg.
 *
 * @since 19.3.0
 */
function gutenberg_default_script_modules() {
	/*
	 * Expects multidimensional array like:
	 *
	 *     'interactivity/index.min.js' => array('dependencies' => array(…), 'version' => '…'),
	 *     'interactivity/debug.min.js' => array('dependencies' => array(…), 'version' => '…'),
	 *     'interactivity-router/index.min.js' => …
	 */
	$assets = include gutenberg_dir_path() . '/build-module/assets.php';

	foreach ( $assets as $file_name => $script_module_data ) {
		/*
		 * Build the FinPress Script Module ID from the file name.
		 * Prepend `@finpress/` and remove extensions and `/index` if present:
		 *   - interactivity/index.min.js  => @finpress/interactivity
		 *   - interactivity/debug.min.js  => @finpress/interactivity/debug
		 *   - block-library/query/view.js => @finpress/block-library/query/view
		 */
		$script_module_id = '@finpress/' . preg_replace( '~(?:/index)?\.min\.js$~D', '', $file_name, 1 );
		switch ( $script_module_id ) {
			/*
			 * Interactivity exposes two entrypoints, "/index" and "/debug".
			 * "/debug" should replace "/index" in development.
			 */
			case '@finpress/interactivity/debug':
				if ( ! SCRIPT_DEBUG ) {
					continue 2;
				}
				$script_module_id = '@finpress/interactivity';
				break;
			case '@finpress/interactivity':
				if ( SCRIPT_DEBUG ) {
					continue 2;
				}
				break;
		}

		$path = gutenberg_url( "build-module/{$file_name}" );
		fp_register_script_module( $script_module_id, $path, $script_module_data['dependencies'], $script_module_data['version'] );
	}
}
remove_action( 'fp_default_scripts', 'fp_default_script_modules' );
add_action( 'fp_default_scripts', 'gutenberg_default_script_modules' );

/*
 * Always remove the Core action hook while gutenberg_enqueue_stored_styles() exists to avoid styles being printed twice.
 * This is also because gutenberg_enqueue_stored_styles uses the Style Engine's `gutenberg_*` functions and `_Gutenberg` classes,
 * which are in continuous development and generally ahead of Core.
 */
remove_action( 'fp_enqueue_scripts', 'fp_enqueue_stored_styles' );
remove_action( 'fp_footer', 'fp_enqueue_stored_styles', 1 );

// Enqueue stored styles.
add_action( 'fp_enqueue_scripts', 'gutenberg_enqueue_stored_styles' );
add_action( 'fp_footer', 'gutenberg_enqueue_stored_styles', 1 );
