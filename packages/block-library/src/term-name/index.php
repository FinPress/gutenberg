<?php
/**
 * Server-side rendering of the `core/term-name` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/term-name` block on the server.
 *
 * @since 6.x.x
 *
 * @param array    $attributes Block attributes.
 * @param WP_Block $block      Block instance.
 *
 * @return string Returns the filtered term name for the current term wrapped inside heading tags.
 */
function render_block_core_term_name( $attributes, $block ) {
	if ( ! isset( $block->context['termId'] ) ) {
		return '';
	}

	$term_id   = $block->context['termId'];
	$term_type = $block->context['taxonomy'] ?? 'category';

	if ( empty( $term_id ) || empty( $term_type ) ) {
		return '';
	}

	if ( ! taxonomy_exists( $term_type ) || ! is_taxonomy_viewable( $term_type ) ) {
		return '';
	}

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
		$rel         = ! empty( $attributes['rel'] ) ? 'rel="' . esc_attr( $attributes['rel'] ) . '"' : '';
		$link_target = isset( $attributes['linkTarget'] ) ? $attributes['linkTarget'] : '_self';

		$term_link = get_term_link( $term );
		if ( is_wp_error( $term_link ) ) {
			$term_link = get_term_link( $term_id, $term_type );
		}

		if ( ! is_wp_error( $term_link ) && ! empty( $term_link ) ) {
			$title = sprintf( '<a href="%1$s" target="%2$s" %3$s>%4$s</a>', esc_url( $term_link ), esc_attr( $link_target ), $rel, $title );
		}
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
 * @since 6.x.x
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
