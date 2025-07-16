<?php
/**
 * Server-side rendering of the `core/post-date` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/post-date` block on the server.
 *
 * @since 5.8.0
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 * @return string Returns the filtered post date for the current post wrapped inside "time" tags.
 */
function render_block_core_post_date( $attributes, $content, $block ) {
	$classes = array();

	if ( ! isset( $attributes['date'] ) ) {
		// This must be the legacy version of the block.
		// In this case, we manually apply block bindings for the
		// `core/post-data` source to set the `date` attribute.

		$source = get_block_bindings_source( 'core/post-data' );

		if ( isset( $attributes['displayType'] ) && 'modified' === $attributes['displayType'] ) {
			$source_args = array(
				'key' => 'modified',
			);
			$classes[]   = 'wp-block-post-date__modified-date';
		} else {
			$source_args = array(
				'key' => 'date',
			);
		}
		$attributes['date'] = $source->get_value( $source_args, $block, 'date' );
	}

	$unformatted_date = $attributes['date'];
	$post_timestamp   = strtotime( $unformatted_date );

	if ( isset( $attributes['format'] ) && 'human-diff' === $attributes['format'] ) {
		if ( $post_timestamp > time() ) {
			// translators: %s: human-readable time difference.
			$formatted_date = sprintf( __( '%s from now' ), human_time_diff( $post_timestamp ) );
		} else {
			// translators: %s: human-readable time difference.
			$formatted_date = sprintf( __( '%s ago' ), human_time_diff( $post_timestamp ) );
		}
	} else {
		$formatted_date = gmdate( empty( $attributes['format'] ) ? get_option( 'date_format' ) : $attributes['format'], $post_timestamp );
	}

	if ( isset( $attributes['textAlign'] ) ) {
		$classes[] = 'has-text-align-' . $attributes['textAlign'];
	}
	if ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) {
		$classes[] = 'has-link-color';
	}

	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $classes ) ) );

	if ( isset( $attributes['isLink'] ) && $attributes['isLink'] && isset( $block->context['postId'] ) ) {
		$formatted_date = sprintf( '<a href="%1s">%2s</a>', get_the_permalink( $block->context['postId'] ), $formatted_date );
	}

	return sprintf(
		'<div %1$s><time datetime="%2$s">%3$s</time></div>',
		$wrapper_attributes,
		$unformatted_date,
		$formatted_date
	);
}

/**
 * Registers the `core/post-date` block on the server.
 *
 * @since 5.8.0
 */
function register_block_core_post_date() {
	register_block_type_from_metadata(
		__DIR__ . '/post-date',
		array(
			'render_callback' => 'render_block_core_post_date',
		)
	);
}
add_action( 'init', 'register_block_core_post_date' );
