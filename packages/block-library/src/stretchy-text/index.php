<?php

/**
 * Stretchy Text block registration.
 *
 * @package WordPress
 */

/**
 * Registers the `core/stretchy-text` block on the server.
 *
 * @since 6.9.0
 *
 * @uses render_block_core_stretchy_text()
 * @throws WP_Error An WP_Error exception parsing the block definition.
 **/
function register_block_core_stretchy_text() {
	// TODO - only enqueue the script if the block is used.
	wp_enqueue_script_module( '@wordpress/block-library/stretchy-text/view' );
	register_block_type_from_metadata(
		__DIR__ . '/stretchy-text',
		array(
			'style_handles' => 'wp-block-stretchy-text', // TODO - this shouldn't be needed.
		)
	);
}

add_action( 'init', 'register_block_core_stretchy_text' );
