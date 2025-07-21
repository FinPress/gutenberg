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
		/*
		 * This can mean two things:
		 *
		 * 1. We're dealing with the legacy version of the block that didn't have the `date` attribute.
		 * 2. The `date` attribute is bound to a Block Bindings source, but we're on a version of WordPress
		 *    that doesn't support the `core/post-data` source.
		 *
		 * In both cases, we set the `date` attribute to its correct value by applying Block Bindings manually.
		 */
		if (
			isset( $attributes['metadata']['bindings']['date']['source'] ) &&
			'core/post-data' === $attributes['metadata']['bindings']['date']['source'] &&
			isset( $attributes['metadata']['bindings']['date']['args'] )
		) {
			// We're using a version of WordPress that doesn't support the `core/post-data` source for block bindings.
			// This branch can be removed once the minimum required WordPress version supports the `core/post-data` source.
			$source_args = $attributes['metadata']['bindings']['date']['args'];
		} else {
			// This is the legacy version of the block that didn't have the `date` attribute.
			// This branch needs to be kept for backward compatibility.
			if ( isset( $attributes['displayType'] ) && 'modified' === $attributes['displayType'] ) {
				$source_args = array(
					'key' => 'modified',
				);
			} else {
				$source_args = array(
					'key' => 'date',
				);
			}
		}

		$source             = get_block_bindings_source( 'core/post-data' );
		$attributes['date'] = $source->get_value( $source_args, $block, 'date' );

		if ( isset( $source_args['key'] ) && 'modified' === $source_args['key'] ) {
			$classes[] = 'wp-block-post-date__modified-date';
		}
	}

	if ( empty( $attributes['date'] ) ) {
		// If the `date` attribute is set but empty, it's because the block is bound to the
		// post's last modified date, and the latter lies before the publish date.
		// In this case, we return an empty string.
		// See https://github.com/WordPress/gutenberg/pull/46839 where this logic was originally
		// implemented.
		return '';
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
