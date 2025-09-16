<?php
/**
 * Plugin Name: Gutenberg Test Block API
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-block-api
 */

/**
 * Registers a custom script for the plugin.
 */
function enqueue_block_api_plugin_script() {
	fin_enqueue_script(
		'gutenberg-test-block-api',
		plugins_url( 'block-api/index.js', __FILE__ ),
		array(
			'fin-blocks',
			'fin-block-editor',
			'fin-element',
			'fin-hooks',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'block-api/index.js' ),
		true
	);
}

add_action( 'init', 'enqueue_block_api_plugin_script' );
