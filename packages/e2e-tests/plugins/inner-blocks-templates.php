<?php
/**
 * Plugin Name: Gutenberg Test InnerBlocks Templates
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-inner-blocks-templates
 */

/**
 * Registers a custom script for the plugin.
 */
function enqueue_inner_blocks_templates_plugin_script() {
	fin_enqueue_script(
		'gutenberg-test-inner-blocks-templates',
		plugins_url( 'inner-blocks-templates/index.js', __FILE__ ),
		array(
			'fin-blocks',
			'fin-components',
			'fin-element',
			'fin-block-editor',
			'fin-hooks',
			'fin-i18n',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'inner-blocks-templates/index.js' ),
		true
	);
}

add_action( 'init', 'enqueue_inner_blocks_templates_plugin_script' );
