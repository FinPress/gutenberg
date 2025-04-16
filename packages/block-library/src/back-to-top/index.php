<?php
/**
 * Server-side rendering of the `core/back-to-top` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/back-to-top` block on the server.
 *
 * @since 6.4.0
 *
 * @param array  $attributes Block attributes.
 * @param string $content    Block default content.
 * @return string Returns the block content.
 */
function render_block_core_back_to_top( $attributes, $content ) {
    wp_enqueue_script_module(
        '@wordpress/block-library/back-to-top/view'
    );
    return $content;
}

/**
 * Registers the `core/back-to-top` block.
 *
 * @since 6.4.0
 */
function register_core_back_to_top_block() {
    register_block_type_from_metadata(
        dirname( __DIR__ ) . '/build/block-library/blocks/back-to-top',
        array(
            'render_callback' => 'render_block_core_back_to_top',
        )
    );
}
add_action( 'init', 'register_core_back_to_top_block' );
