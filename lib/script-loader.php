<?php
/**
 * Overrides the script-loader.php file.
 *
 * @package gutenberg
 */

// Remove core actions to override.
remove_action( 'wp_enqueue_scripts', 'wp_enqueue_global_styles' );
remove_action( 'wp_footer', 'wp_enqueue_global_styles', 1 );

/**
 * Enqueues the global styles defined via theme.json.
 *
 * Copy of the core `wp_enqueue_global_styles`. Uses helper methods bundled with the plugin.
 *
 * @return void
 */
function gutenberg_enqueue_global_styles() {
	$separate_assets  = wp_should_load_separate_core_block_assets();
	$is_block_theme   = wp_is_block_theme();
	$is_classic_theme = ! $is_block_theme;

	/*
	 * Global styles should be printed in the head when loading all styles combined.
	 * The footer should only be used to print global styles for classic themes with separate core assets enabled.
	 *
	 * See https://core.trac.wordpress.org/ticket/53494.
	 */
	if (
		( $is_block_theme && doing_action( 'wp_footer' ) ) ||
		( $is_classic_theme && doing_action( 'wp_footer' ) && ! $separate_assets ) ||
		( $is_classic_theme && doing_action( 'wp_enqueue_scripts' ) && $separate_assets )
	) {
		return;
	}

	/*
	 * If loading the CSS for each block separately, then load the theme.json CSS conditionally.
	 * This removes the CSS from the global-styles stylesheet and adds it to the inline CSS for each block.
	 * This filter must be registered before calling wp_get_global_stylesheet();
	 */
	add_filter( 'wp_theme_json_get_style_nodes', 'wp_filter_out_block_nodes' );

	$stylesheet = gutenberg_get_global_stylesheet();

	if ( $is_block_theme ) {
		/*
		 * Remove the Customizer's Custom CSS from being printed as a separate stylesheet in a block theme since it is
		 * merged into the global styles.
		 */
		remove_action( 'wp_head', 'wp_custom_css_cb', 101 );

		/*
		 * Get the custom CSS from the Customizer and add it to the global stylesheet.
		 * When in the Customizer preview, add milestone comments to allow customize-preview.js inject the CSS updates.
		 */
		if ( is_customize_preview() ) {
			$stylesheet .= "\n/*BEGIN_CUSTOMIZER_CUSTOM_CSS*/\n";
		}
		$stylesheet .= wp_get_custom_css();
		if ( is_customize_preview() ) {
			$stylesheet .= "\n/*END_CUSTOMIZER_CUSTOM_CSS*/\n";
		}

		// Add the global styles custom CSS at the end.
		$stylesheet .= gutenberg_get_global_stylesheet( array( 'custom-css' ) );
	}

	if ( empty( $stylesheet ) ) {
		return;
	}

	wp_register_style( 'global-styles', false );
	wp_add_inline_style( 'global-styles', $stylesheet );
	wp_enqueue_style( 'global-styles' );

	// Add each block as an inline css.
	gutenberg_add_global_styles_for_blocks();
}
add_action( 'wp_enqueue_scripts', 'gutenberg_enqueue_global_styles' );
add_action( 'wp_footer', 'gutenberg_enqueue_global_styles', 1 );

/**
 * Adds JS logic to the Customizer preview for live previewing Custom CSS for Block Themes.
 *
 * Note: The logic in this function would be back-ported into customize-preview.js.
 */
function gutenberg_add_customizer_block_theme_custom_css_preview_js() {
	if ( ! ( is_customize_preview() && wp_is_block_theme() ) ) {
		return;
	}

	$setting_id = 'custom_css[' . get_stylesheet() . ']';

	$js_function = <<<JS
		( settingId ) => {
			wp.customize( settingId, function ( setting ) {
				setting.bind( function ( newValue ) {
					const style = document.querySelector( 'style#global-styles-inline-css' );
					if ( ! style ) {
						return;
					}
					newValue = newValue.replace( /\/\*(BEGIN|END)_CUSTOMIZER_CUSTOM_CSS\*\//g, '' ); // Forbid milestone comments from appearing in Custom CSS which would break live preview.
					style.textContent = style.textContent.replace( /(\/\*BEGIN_CUSTOMIZER_CUSTOM_CSS\*\/)((?:.|\s)*?)(\/\*END_CUSTOMIZER_CUSTOM_CSS\*\/)/, function ( match, beforeComment, oldValue, afterComment ) {
						return beforeComment + newValue + afterComment;
					} );
				} );
			} )
		}
JS;
	wp_add_inline_script(
		'customize-preview',
		sprintf( '( %s )( %s )', $js_function, wp_json_encode( $setting_id ) )
	);
}
add_action( 'wp_enqueue_scripts', 'gutenberg_add_customizer_block_theme_custom_css_preview_js' );

/**
 * Enqueues the global styles custom css.
 *
 * @since 6.2.0
 */
function gutenberg_enqueue_global_styles_custom_css() {
	_deprecated_function( __FUNCTION__, 'Gutenberg 17.8.0', 'gutenberg_enqueue_global_styles' );
	if ( ! wp_is_block_theme() ) {
		return;
	}

	// Don't enqueue Customizer's custom CSS separately.
	remove_action( 'wp_head', 'wp_custom_css_cb', 101 );

	$custom_css  = wp_get_custom_css();
	$custom_css .= gutenberg_get_global_styles_custom_css();

	if ( ! empty( $custom_css ) ) {
		wp_add_inline_style( 'global-styles', $custom_css );
	}
}

/**
 * Function that enqueues the CSS Custom Properties coming from theme.json.
 *
 * @since 5.9.0
 */
function gutenberg_enqueue_global_styles_css_custom_properties() {
	wp_register_style( 'global-styles-css-custom-properties', false );
	wp_add_inline_style( 'global-styles-css-custom-properties', gutenberg_get_global_stylesheet( array( 'variables' ) ) );
	wp_enqueue_style( 'global-styles-css-custom-properties' );
}
remove_action( 'enqueue_block_editor_assets', 'wp_enqueue_global_styles_css_custom_properties' );
add_action( 'enqueue_block_editor_assets', 'gutenberg_enqueue_global_styles_css_custom_properties' );
