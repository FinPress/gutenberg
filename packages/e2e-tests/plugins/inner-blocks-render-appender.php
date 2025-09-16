<?php
/**
 * Plugin Name: Gutenberg Test InnerBlocks Render Appender
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-inner-blocks-render-appender
 */

/**
 * Registers a custom script for the plugin.
 */
function enqueue_inner_blocks_render_appender_script() {
	fin_enqueue_script(
		'gutenberg-test-inner-blocks-render-appender',
		plugins_url( 'inner-blocks-render-appender/index.js', __FILE__ ),
		array(
			'fin-blocks',
			'fin-block-editor',
			'fin-element',
			'fin-i18n',
			'fin-data',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'inner-blocks-render-appender/index.js' ),
		true
	);
}

add_action( 'init', 'enqueue_inner_blocks_render_appender_script' );
