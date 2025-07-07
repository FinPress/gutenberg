<?php
/**
 * Server-side rendering of the `core/term-name` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/term-name` block on the server.
 *
 * @since 6.0.0
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 *
 * @return string Returns the filtered term name for the current term wrapped inside heading tags.
 */
function render_block_core_term_name( $attributes, $content, $block ) {
	if ( ! isset( $block->context['termId'] ) ) {
		return '';
	}

	$term_id = $block->context['termId'];
	$term_type = $block->context['termType'] ?? 'category';

	$term = get_term( $term_id, $term_type );
	if ( ! $term || is_wp_error( $term ) ) {
		return '';
	}

	$title = $term->name;

	if ( ! $title ) {
		return '';
	}

	$tag_name = 'span';

	if ( isset( $attributes['isLink'] ) && $attributes['isLink'] ) {
		$rel   = ! empty( $attributes['rel'] ) ? 'rel="' . esc_attr( $attributes['rel'] ) . '"' : '';
		$title = sprintf( '<a href="%1$s" target="%2$s" %3$s>%4$s</a>', esc_url( get_term_link( $term ) ), esc_attr( $attributes['linkTarget'] ), $rel, $title );
	}

	$classes = array();
	if ( isset( $attributes['textAlign'] ) ) {
		$classes[] = 'has-text-align-' . $attributes['textAlign'];
	}
	if ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) {
		$classes[] = 'has-link-color';
	}
	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $classes ) ) );

	return sprintf(
		'<%1$s %2$s>%3$s</%1$s>',
		$tag_name,
		$wrapper_attributes,
		$title
	);
}

/**
 * Registers the `core/term-name` block on the server.
 *
 * @since 6.0.0
 */
function register_block_core_term_name() {
	register_block_type_from_metadata(
		__DIR__ . '/term-name',
		array(
			'render_callback' => 'render_block_core_term_name',
		)
	);
}
add_action( 'init', 'register_block_core_term_name' );
