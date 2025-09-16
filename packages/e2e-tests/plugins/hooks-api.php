<?php
/**
 * Plugin Name: Gutenberg Test Hooks API
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-hooks-api
 */

/**
 * Registers a custom script for the plugin.
 */
function enqueue_hooks_plugin_script() {
	fin_enqueue_script(
		'gutenberg-test-hooks-api',
		plugins_url( 'hooks-api/index.js', __FILE__ ),
		array(
			'fin-blocks',
			'fin-components',
			'fin-element',
			'fin-block-editor',
			'fin-hooks',
			'fin-i18n',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'hooks-api/index.js' ),
		true
	);
}

add_action( 'init', 'enqueue_hooks_plugin_script' );
