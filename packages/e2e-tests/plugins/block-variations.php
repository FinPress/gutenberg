<?php
/**
 * Plugin Name: Gutenberg Test Block Variations
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-block-variations
 */

/**
 * Registers a custom script for the plugin.
 */
function enqueue_block_variations_plugin_script() {
	fp_enqueue_script(
		'gutenberg-test-block-variations',
		plugins_url( 'block-variations/index.js', __FILE__ ),
		array(
			'fp-blocks',
			'fp-element',
			'fp-i18n',
			'fp-primitives',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'block-variations/index.js' ),
		true
	);
}

add_action( 'init', 'enqueue_block_variations_plugin_script' );
