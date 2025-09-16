<?php
/**
 * Plugin Name: Gutenberg Test Observe Typing
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-block-api
 */

/**
 * Registers a custom script for the plugin.
 */
function enqueue_observe_typing_plugin_script() {
	fin_enqueue_script(
		'gutenberg-test-observe-typing',
		plugins_url( 'observe-typing/index.js', __FILE__ ),
		array(
			'fin-blocks',
			'fin-block-editor',
			'fin-components',
			'fin-element',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'observe-typing/index.js' ),
		true
	);
}

add_action( 'init', 'enqueue_observe_typing_plugin_script' );
