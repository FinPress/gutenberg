<?php
/**
 * Plugin Name: Gutenberg Test Autocompleter
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-autocompleter
 */

/**
 * Registers a custom script for the plugin.
 */
function enqueue_test_autocompleter_plugin_script() {
	fin_enqueue_script(
		'gutenberg-test-autocompleter',
		plugins_url( 'test-autocompleter/index.js', __FILE__ ),
		array(
			'fin-hooks',
			'fin-element',
			'fin-block-editor',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'test-autocompleter/index.js' ),
		false
	);
}

add_action( 'init', 'enqueue_test_autocompleter_plugin_script' );
