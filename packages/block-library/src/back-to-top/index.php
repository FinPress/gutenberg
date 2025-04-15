<?php
/**
 * Server-side rendering of the `core/back-to-top` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/back-to-top` block on the server.
 *
 * @param array  $attributes Block attributes.
 * @param string $content    Block default content.
 * @return string Returns the block content.
 */
function render_block_core_back_to_top($attributes, $content) {
    wp_enqueue_script_module(
        '@wordpress/block-library/back-to-top/view'
    );
    return $content;
}

register_block_type_from_metadata(
	// wp_die('loading');
    gutenberg_dir_path() . 'build/block-library/blocks/back-to-top',
    array(
        'render_callback' => 'render_block_core_back_to_top',
    )
);
