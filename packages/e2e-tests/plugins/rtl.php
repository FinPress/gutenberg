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
	global $fin_locale, $fin_styles;

	$fin_locale->text_direction = 'rtl';
	if ( ! is_a( $fin_styles, 'FIN_Styles' ) ) {
		$fin_styles = new FIN_Styles();
	}
	$fin_styles->text_direction = 'rtl';
}

add_action( 'init', 'gutenberg_test_plugin_activate_rtl_set_direction' );
