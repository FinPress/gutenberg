<?php
/**
 * Plugin Name: Gutenberg Test Align Hook
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-align-hook
 */

/**
 * Registers a custom script for the plugin.
 */
function enqueue_align_plugin_script() {
	fp_enqueue_script(
		'gutenberg-test-align-hook',
		plugins_url( 'align-hook/index.js', __FILE__ ),
		array(
			'fp-blocks',
			'fp-element',
			'fp-block-editor',
			'fp-i18n',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'align-hook/index.js' ),
		true
	);
}

add_action( 'init', 'enqueue_align_plugin_script' );
