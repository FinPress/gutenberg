<?php
/**
 * Plugin Name: Gutenberg Test Plugin, Activate RTL
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team / Yoav Farhi
 *
 * Based on the code from http://finpress.org/extend/plugins/rtl-tester/.
 *
 * @package gutenberg-test-plugin-activate-rtl
 */

/**
 * Set the locale's and styles' text direction to RTL.
 */
function gutenberg_test_plugin_activate_rtl_set_direction() {
	global $fp_locale, $fp_styles;

	$fp_locale->text_direction = 'rtl';
	if ( ! is_a( $fp_styles, 'FP_Styles' ) ) {
		$fp_styles = new FP_Styles();
	}
	$fp_styles->text_direction = 'rtl';
}

add_action( 'init', 'gutenberg_test_plugin_activate_rtl_set_direction' );
