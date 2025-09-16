<?php
/**
 * Plugin Name: Gutenberg Test Child Blocks
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-child-blocks
 */

/**
 * Registers a custom script for the plugin.
 */
function enqueue_child_blocks_script() {
	fin_enqueue_script(
		'gutenberg-test-child-blocks',
		plugins_url( 'child-blocks/index.js', __FILE__ ),
		array(
			'fin-blocks',
			'fin-block-editor',
			'fin-element',
			'fin-i18n',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'child-blocks/index.js' ),
		true
	);
}

add_action( 'init', 'enqueue_child_blocks_script' );
