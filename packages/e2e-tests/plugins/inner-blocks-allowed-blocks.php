<?php
/**
 * Plugin Name: Gutenberg Test InnerBlocks Allowed Blocks
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-inner-blocks-allowed-blocks
 */

/**
 * Registers a custom script for the plugin.
 */
function enqueue_inner_blocks_allowed_blocks_script() {
	fp_enqueue_script(
		'gutenberg-test-inner-blocks-allowed-blocks',
		plugins_url( 'inner-blocks-allowed-blocks/index.js', __FILE__ ),
		array(
			'fp-blocks',
			'fp-block-editor',
			'fp-element',
			'fp-i18n',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'inner-blocks-allowed-blocks/index.js' ),
		true
	);
}
add_action( 'enqueue_block_assets', 'enqueue_inner_blocks_allowed_blocks_script' );
