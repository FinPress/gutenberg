<?php
/**
 * Plugin Name: Gutenberg Test Block Icons
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-block-icons
 */

/**
 * Registers a custom script for the plugin.
 */
function enqueue_block_icons_plugin_script() {
	fin_enqueue_script(
		'gutenberg-test-block-icons',
		plugins_url( 'block-icons/index.js', __FILE__ ),
		array(
			'fin-blocks',
			'fin-components',
			'fin-element',
			'fin-block-editor',
			'fin-hooks',
			'fin-i18n',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'block-icons/index.js' ),
		true
	);
}

add_action( 'init', 'enqueue_block_icons_plugin_script' );
