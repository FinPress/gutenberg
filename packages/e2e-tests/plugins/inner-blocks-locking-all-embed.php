<?php
/**
 * Plugin Name: Gutenberg Test InnerBlocks Locking All Embed
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-inner-blocks-locking-all-embed
 */

/**
 * Registers a custom script for the plugin.
 */
function enqueue_inner_blocks_locking_all_embed_plugin_script() {
	fp_enqueue_script(
		'gutenberg-test-inner-blocks-locking-all-embed',
		plugins_url( 'inner-blocks-locking-all-embed/index.js', __FILE__ ),
		array(
			'fp-blocks',
			'fp-element',
			'fp-block-editor',
			'fp-i18n',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'inner-blocks-locking-all-embed/index.js' ),
		true
	);
}

add_action( 'init', 'enqueue_inner_blocks_locking_all_embed_plugin_script' );
