<?php
/**
 * Plugin Name: Gutenberg Test Container Block Without paragraph
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-container-without-paragraph
 */

/**
 * Registers a custom script for the plugin.
 */
function enqueue_container_without_paragraph_plugin_script() {
	fin_enqueue_script(
		'gutenberg-test-container-without-paragraph',
		plugins_url( 'container-without-paragraph/index.js', __FILE__ ),
		array(
			'fin-blocks',
			'fin-element',
			'fin-block-editor',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'container-without-paragraph/index.js' ),
		true
	);
}

add_action( 'init', 'enqueue_container_without_paragraph_plugin_script' );
