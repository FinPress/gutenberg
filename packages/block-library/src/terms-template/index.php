<?php
/**
 * Server-side rendering of the `core/terms-template` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/terms-template` block on the server.
 *
 * @since 6.0.0
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 *
 * @return string Returns the output of the terms template.
 */
function render_block_core_terms_template( $attributes, $content, $block ) {
	// The terms template block is a container block that renders its inner blocks.
	// The actual rendering is handled by the terms-query block which provides the context.
	return $content;
}

/**
 * Registers the `core/terms-template` block on the server.
 *
 * @since 6.0.0
 */
function register_block_core_terms_template() {
	register_block_type_from_metadata(
		__DIR__ . '/terms-template',
		array(
			'render_callback' => 'render_block_core_terms_template',
		)
	);
}
add_action( 'init', 'register_block_core_terms_template' );
