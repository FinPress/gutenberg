<?php
/**
 * Server-side rendering of the `core/term-count` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/term-count` block on the server.
 *
 * @since 6.0.0
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 *
 * @return string Returns the term count for the current term.
 */
function render_block_core_term_count( $attributes, $content, $block ) {
	if ( ! isset( $block->context['termId'] ) ) {
		return '';
	}

	$term_id = $block->context['termId'];
	$term_type = $block->context['termType'] ?? 'category';

	$term = get_term( $term_id, $term_type );
	if ( ! $term || is_wp_error( $term ) ) {
		return '';
	}

	$count = $term->count;
	$format = $attributes['format'] ?? '';

	$formatted_count = $format ? str_replace( '%d', $count, $format ) : $count;

	$classes = array();
	if ( isset( $attributes['textAlign'] ) ) {
		$classes[] = 'has-text-align-' . $attributes['textAlign'];
	}
	if ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) {
		$classes[] = 'has-link-color';
	}
	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $classes ) ) );

	return sprintf(
		'<span %1$s>%2$s</span>',
		$wrapper_attributes,
		$formatted_count
	);
}

/**
 * Registers the `core/term-count` block on the server.
 *
 * @since 6.0.0
 */
function register_block_core_term_count() {
	register_block_type_from_metadata(
		__DIR__ . '/term-count',
		array(
			'render_callback' => 'render_block_core_term_count',
		)
	);
}
add_action( 'init', 'register_block_core_term_count' );
