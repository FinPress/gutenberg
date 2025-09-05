<?php
/**
 * Plugin Name: Gutenberg Test InnerBlocks Prioritized Inserter Blocks
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-inner-blocks-prioritized-inserter-blocks
 */

/**
 * Registers a custom script for the plugin.
 */
function enqueue_inner_blocks_prioritized_inserter_blocks_script() {
	fp_enqueue_script(
		'gutenberg-test-inner-blocks-prioritized-inserter-blocks',
		plugins_url( 'inner-blocks-prioritized-inserter-blocks/index.js', __FILE__ ),
		array(
			'fp-blocks',
			'fp-block-editor',
			'fp-element',
			'fp-i18n',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'inner-blocks-prioritized-inserter-blocks/index.js' ),
		true
	);
}

add_action( 'init', 'enqueue_inner_blocks_prioritized_inserter_blocks_script' );
