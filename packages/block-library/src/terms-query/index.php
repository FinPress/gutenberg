<?php
/**
 * Server-side rendering of the `core/terms-query` block.
 *
 * @package WordPress
 */

/**
 * Note: The following WordPress core functions/classes are used and are globally available:
 * is_category, is_tag, is_tax, get_queried_object, is_wp_error, get_option, WP_Term_Query,
 * get_block_wrapper_attributes, render_single_term
 */

/**
 * Renders the `core/terms-query` block on the server.
 *
 * @since 6.0.0
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 *
 * @return string Returns the output of the query, structured using the layout defined by the block's inner blocks.
 */
function render_block_core_terms_query( $attributes, $content, $block ) {
	$query = $attributes['query'] ?? array();

	$query_args = array(
		'taxonomy'   => $query['taxonomy'] ?? 'category',
		'order'      => $query['order'] ?? 'asc',
		'orderby'    => $query['orderBy'] ?? 'name',
		'hide_empty' => isset( $query['hideEmpty'] ) ? (bool) $query['hideEmpty'] : true,
		'hierarchical' => $query['hierarchical'] ?? false,
	);

	$terms_query = new WP_Term_Query( $query_args );
	$terms       = $terms_query->get_terms();

	if ( ! $terms || is_wp_error( $terms ) ) {
		return '<div class="wp-block-terms-query"><p>No terms found.</p></div>';
	}

	// Filter to show only top-level terms if showOnlyTopLevel is enabled
	if ( ! empty( $query['showOnlyTopLevel'] ) ) {
		$terms = array_filter( $terms, function( $term ) {
			return empty( $term->parent );
		} );
	}

	$classnames = 'wp-block-terms-query';
	if ( isset( $block->context['displayLayout'] ) && isset( $block->context['query'] ) ) {
		if ( isset( $block->context['displayLayout']['type'] ) && 'flex' === $block->context['displayLayout']['type'] ) {
			$classnames .= " is-flex-container columns-{$block->context['displayLayout']['columns']}";
		}
	}

	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $classnames ) );

	$content = '';
	foreach ( $terms as $term ) {

		// Get the inner blocks from the terms-template block
		$inner_blocks = $block->inner_blocks;

		// If no inner blocks, create a simple fallback
		if ( empty( $inner_blocks ) ) {
			$block_content = '<span class="wp-block-term-name">' . esc_html( $term->name ) . '</span>';
		} else {
			$term_id   = $term->term_id;
			$term_type = $term->taxonomy;

			$filter_block_context = static function ( $context ) use ( $term_id, $term_type ) {
				$context['termId']   = $term_id;
				$context['termType'] = $term_type;
				return $context;
			};

			// Use an early priority so that other 'render_block_context' filters have access to the values.
			add_filter( 'render_block_context', $filter_block_context, 1 );

			// Render the inner blocks with the term context
			$block_content = '';
			foreach ( $inner_blocks as $inner_block ) {
				$block_content .= $inner_block->render( array( 'dynamic' => true ) );
			}

			remove_filter( 'render_block_context', $filter_block_context, 1 );
		}

		// If no content was rendered, create a simple fallback
		if ( empty( $block_content ) ) {
			$block_content = '<span class="wp-block-term-name">' . esc_html( $term->name ) . '</span>';
			$block_content .= '<span class="wp-block-term-count">' . $term->count . '</span>';
		}

		// Wrap the rendered inner blocks in a `li` element with the appropriate term classes.
		$term_classes = implode( ' ', array( 'wp-block-term', 'term-' . $term->term_id ) );

		$content .= '<li class="' . esc_attr( $term_classes ) . '">' . $block_content . '</li>';
	}

	return sprintf(
		'<div %1$s><ul>%2$s</ul></div>',
		$wrapper_attributes,
		$content
	);
}

/**
 * Registers the `core/terms-query` block on the server.
 *
 * @since 6.0.0
 */
function register_block_core_terms_query() {
	register_block_type_from_metadata(
		__DIR__ . '/terms-query',
		array(
			'render_callback' => 'render_block_core_terms_query',
		)
	);
}
add_action( 'init', 'register_block_core_terms_query' );
