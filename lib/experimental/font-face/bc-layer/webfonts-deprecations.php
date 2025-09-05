<?php
/**
 * Deprecated functions provided here to give extenders time to change
 * their plugins/themes before this API is introduced into Core.
 *
 * BACKPORT NOTE: Do not backport these deprecated functions to Core.
 *
 * @package    FinPress
 * @subpackage Fonts API
 * @since      X.X.X
 */

if ( ! function_exists( 'fp_webfonts' ) ) {
	/**
	 * Initialize $fp_webfonts if it has not been set.
	 *
	 * @since X.X.X
	 * @deprecated 15.1 Use fp_fonts() instead.
	 * @deprecated 16.3.0 No longer functional. Do not use.
	 *
	 * @global FP_Webfonts $fp_webfonts
	 *
	 * @return FP_Webfonts FP_Webfonts instance.
	 */
	function fp_webfonts() {
		_deprecated_function( __FUNCTION__, 'Gutenberg 15.1' );

		global $fp_webfonts;

		if ( ! ( $fp_webfonts instanceof FP_Webfonts ) ) {
			$fp_webfonts = new FP_Webfonts();
		}

		return $fp_webfonts;
	}
}

if ( ! function_exists( 'fp_register_webfonts' ) ) {
	/**
	 * Registers one or more font-families and each of their variations.
	 *
	 * @since X.X.X
	 * @deprecated 15.1 Use fp_register_fonts() instead.
	 * @deprecated 16.3.0 Register is not supported.
	 *
	 * @return array Empty array.
	 */
	function fp_register_webfonts() {
		_deprecated_function( __FUNCTION__, 'Gutenberg 15.1' );
		return array();
	}
}

if ( ! function_exists( 'fp_register_webfont' ) ) {
	/**
	 * Registers a single webfont.
	 *
	 * @since X.X.X
	 * @deprecated 14.9.1 Use fp_register_fonts().
	 * @deprecated 16.3.0 Register is not supported.
	 *
	 * @return bool False.
	 */
	function fp_register_webfont() {
		_deprecated_function( __FUNCTION__, 'Gutenberg 14.9.1' );
		return false;
	}
}

if ( ! function_exists( 'fp_enqueue_webfonts' ) ) {
	/**
	 * Enqueues one or more font family and all of its variations.
	 *
	 * @since X.X.X
	 * @deprecated 15.1 Use fp_enqueue_fonts() instead.
	 * @deprecated 16.3.0 Enqueue is not supported.
	 */
	function fp_enqueue_webfonts() {
		_deprecated_function( __FUNCTION__, 'Gutenberg 15.1' );
	}
}

if ( ! function_exists( 'fp_enqueue_webfont' ) ) {
	/**
	 * Enqueue a single font family that has been registered beforehand.
	 *
	 * @since X.X.X
	 * @deprecated 14.9.1 Use fp_enqueue_fonts() instead.
	 * @deprecated 16.3.0 Enqueue is not supported.
	 *
	 * @return bool False.
	 */
	function fp_enqueue_webfont() {
		_deprecated_function( __FUNCTION__, 'Gutenberg 14.9.1' );
		return false;
	}
}

if ( ! function_exists( 'fp_enqueue_webfont_variations' ) ) {
	/**
	 * Enqueues a specific set of web font variations.
	 *
	 * @since X.X.X
	 * @deprecated 15.1 Use fp_enqueue_font_variations() instead.
	 * @deprecated 16.3.0 No longer functional. Do not use.
	 */
	function fp_enqueue_webfont_variations() {
		_deprecated_function( __FUNCTION__, 'Gutenberg 15.1' );
	}
}

if ( ! function_exists( 'fp_deregister_webfont_variation' ) ) {
	/**
	 * Deregisters a font variation.
	 *
	 * @since 14.9.1
	 * @deprecated 15.1 Use fp_deregister_font_variation() instead.
	 * @deprecated 16.3.0 Deregister is not supported.
	 */
	function fp_deregister_webfont_variation() {
		_deprecated_function( __FUNCTION__, 'Gutenberg 15.1' );
	}
}

if ( ! function_exists( 'fp_get_webfont_providers' ) ) {
	/**
	 * Gets all registered providers.
	 *
	 * @since X.X.X
	 * @deprecated 14.9.1 Use fp_fonts()->get_providers().
	 * @deprecated 16.3.0 Providers are not supported.
	 *
	 * @return array Empty array.
	 */
	function fp_get_webfont_providers() {
		_deprecated_function( __FUNCTION__, '14.9.1' );

		return array();
	}
}

if ( ! function_exists( 'fp_register_webfont_provider' ) ) {
	/**
	 * Registers a custom font service provider.
	 *
	 * @since X.X.X
	 * @deprecated 15.1 Use fp_register_font_provider() instead.
	 * @deprecated 16.3.0 Providers are not supported.
	 *
	 * @return bool False.
	 */
	function fp_register_webfont_provider() {
		_deprecated_function( __FUNCTION__, 'GB 15.1', 'fp_register_font_provider' );
		return false;
	}
}

if ( ! function_exists( 'fp_print_webfonts' ) ) {
	/**
	 * Invokes each provider to process and print its styles.
	 *
	 * @since 14.9.1
	 * @deprecated 15.1 Use fp_print_fonts() instead.
	 * @deprecated 16.3.0 Webfonts API is not supported.
	 *
	 * @return array Empty array.
	 */
	function fp_print_webfonts() {
		_deprecated_function( __FUNCTION__, 'Gutenberg 15.1', 'fp_print_font_faces' );
		return array();
	}
}

if ( ! function_exists( 'fp_fonts' ) ) {
	/**
	 * Initialize $fp_fonts if it has not been set.
	 *
	 * @since X.X.X
	 * @deprecated 16.3.0 Use Font Library and Font Face. Fonts API is not supported.
	 *
	 * @global FP_Fonts $fp_fonts
	 *
	 * @return FP_Fonts FP_Fonts instance.
	 */
	function fp_fonts() {
		_deprecated_function( __FUNCTION__, 'Gutenberg 16.3' );

		global $fp_fonts;

		if ( ! ( $fp_fonts instanceof FP_Fonts ) ) {
			$fp_fonts = new FP_Fonts();
		}

		return $fp_fonts;
	}
}

if ( ! function_exists( 'fp_register_fonts' ) ) {
	/**
	 * Registers one or more font-families and each of their variations.
	 *
	 * @since X.X.X
	 * @deprecated 16.3.0 Register is not supported.
	 *
	 * @return array Empty array.
	 */
	function fp_register_fonts() {
		_deprecated_function( __FUNCTION__, 'Gutenberg 16.3' );
		return array();
	}
}

if ( ! function_exists( 'fp_enqueue_fonts' ) ) {
	/**
	 * Enqueues one or more font family and all of its variations.
	 *
	 * @since X.X.X
	 * @deprecated 16.3.0 Enqueue is not supported.
	 */
	function fp_enqueue_fonts() {
		_deprecated_function( __FUNCTION__, 'Gutenberg 16.3' );
	}
}

if ( ! function_exists( 'fp_enqueue_font_variations' ) ) {
	/**
	 * Enqueues a specific set of font variations.
	 *
	 * @since X.X.X
	 * @deprecated 16.3.0 Enqueue is not supported.
	 */
	function fp_enqueue_font_variations() {
		_deprecated_function( __FUNCTION__, 'Gutenberg 16.3' );
	}
}

if ( ! function_exists( 'fp_deregister_font_family' ) ) {
	/**
	 * Deregisters a font family and all of its registered variations.
	 *
	 * @since X.X.X
	 * @deprecated 16.3.0 Deregister is not supported.
	 */
	function fp_deregister_font_family() {
		_deprecated_function( __FUNCTION__, 'Gutenberg 16.3' );
	}
}

if ( ! function_exists( 'fp_deregister_font_variation' ) ) {
	/**
	 * Deregisters a font variation.
	 *
	 * @since X.X.X
	 * @deprecated 16.3.0 Deregister is not supported.
	 */
	function fp_deregister_font_variation() {
		_deprecated_function( __FUNCTION__, 'Gutenberg 16.3' );
	}
}

if ( ! function_exists( 'fp_register_font_provider' ) ) {
	/**
	 * Registers a custom font service provider.
	 *
	 * @since X.X.X
	 * @deprecated 16.3.0 Providers are not supported.
	 *
	 * @return bool False.
	 */
	function fp_register_font_provider() {
		_deprecated_function( __FUNCTION__, 'Gutenberg 16.3' );
		return false;
	}
}

if ( ! function_exists( 'fp_print_fonts' ) ) {
	/**
	 * Invokes each provider to process and print its styles.
	 *
	 * @since X.X.X
	 * @deprecated 16.3.0 For classic themes, use fp_print_font_faces(). For all other sites,
	 *                    Font Face will automatically print all fonts in theme.json merged data layer,
	 *                    including in theme and user activated fonts from the Font Library.
	 *
	 * @return array Empty array.
	 */
	function fp_print_fonts() {
		_deprecated_function( __FUNCTION__, 'Gutenberg 16.3', 'fp_print_font_faces' );
		return array();
	}
}
