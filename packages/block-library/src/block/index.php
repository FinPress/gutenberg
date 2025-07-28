<?php
/**
 * Server-side rendering of the `core/block` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/block` block on server.
 *
 * @since 5.0.0
 *
 * @global WP_Embed $wp_embed
 *
 * @param array $attributes The block attributes.
 *
 * @return string Rendered HTML of the referenced block.
 */
function render_block_core_block( $attributes, $content, $block_instance ) {
	static $seen_refs = array();

	if ( empty( $attributes['ref'] ) ) {
		return '';
	}

	$reusable_block = get_post( $attributes['ref'] );
	if ( ! $reusable_block || 'wp_block' !== $reusable_block->post_type ) {
		return '';
	}

	if ( isset( $seen_refs[ $attributes['ref'] ] ) ) {
		// WP_DEBUG_DISPLAY must only be honored when WP_DEBUG. This precedent
		// is set in `wp_debug_mode()`.
		$is_debug = WP_DEBUG && WP_DEBUG_DISPLAY;

		return $is_debug ?
			// translators: Visible only in the front end, this warning takes the place of a faulty block.
			__( '[block rendering halted]' ) :
			'';
	}

	if ( 'publish' !== $reusable_block->post_status || ! empty( $reusable_block->post_password ) ) {
		return '';
	}

	$seen_refs[ $attributes['ref'] ] = true;

	// Handle embeds for reusable blocks.
	global $wp_embed;
	$content = $wp_embed->run_shortcode( $reusable_block->post_content );
	$content = $wp_embed->autoembed( $content );

	// Back compat.
	// For blocks that have not been migrated in the editor, add some back compat
	// so that front-end rendering continues to work.

	// This matches the `v2` deprecation. Removes the inner `values` property
	// from every item.
	if ( isset( $attributes['content'] ) ) {
		foreach ( $attributes['content'] as &$content_data ) {
			if ( isset( $content_data['values'] ) ) {
				$is_assoc_array = is_array( $content_data['values'] ) && ! wp_is_numeric_array( $content_data['values'] );

				if ( $is_assoc_array ) {
					$content_data = $content_data['values'];
				}
			}
		}
	}

	// This matches the `v1` deprecation. Rename `overrides` to `content`.
	if ( isset( $attributes['overrides'] ) && ! isset( $attributes['content'] ) ) {
		$attributes['content'] = $attributes['overrides'];
	}

	/**
	 * We make the available_context property available so we can add and filter all the context
	 * that comes from the block parent, including pattern overrides and custom context.
	 */

	try {
		$reflection                 = new ReflectionClass( $block_instance );
		$available_context_property = $reflection->getProperty( 'available_context' );
		$available_context_property->setAccessible( true );
		$available_context = $available_context_property->getValue( $block_instance ) ?? array();
	} catch ( Exception $e ) {
		// Fallback to empty array if reflection fails
		$available_context = array();
	}

	// Get the pattern overrides context
	$provides_context = $block_instance->block_type->provides_context ?? array();

	$filter_block_context = static function ( $context ) use ( $attributes, $available_context, $provides_context ) {
		// First, merge in all the available context from the parent
		$context = array_merge( $context, $available_context );

		// Then, add pattern overrides context (only for keys that are actually attributes)
		foreach ( $provides_context as $context_key => $attribute_name ) {
			if ( isset( $attributes[ $attribute_name ] ) ) {
				$context[ $context_key ] = $attributes[ $attribute_name ];
			}
		}

		return $context;
	};
	add_filter( 'render_block_context', $filter_block_context, 1 );

	// Apply Block Hooks.
	$content = apply_block_hooks_to_content_from_post_object( $content, $reusable_block );

	$content = do_blocks( $content );
	unset( $seen_refs[ $attributes['ref'] ] );
	remove_filter( 'render_block_context', $filter_block_context, 1 );

	return $content;
}

/**
 * Registers the `core/block` block.
 *
 * @since 5.3.0
 */
function register_block_core_block() {
	register_block_type_from_metadata(
		__DIR__ . '/block',
		array(
			'render_callback' => 'render_block_core_block',
		)
	);
}
add_action( 'init', 'register_block_core_block' );
