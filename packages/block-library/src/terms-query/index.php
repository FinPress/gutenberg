<?php
/**
 * Server-side rendering of the `core/terms-query` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/terms-query` block on the server.
 *
 * @since 6.x.x
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
		'hide_empty' => $query['hideEmpty'] ?? true,
		'hierarchical' => $query['hierarchical'] ?? false,
	);

	$terms_query = new WP_Term_Query( $query_args );
	$terms       = $terms_query->get_terms();

	if ( ! $terms || is_wp_error( $terms ) ) {
		return '<div class="wp-block-terms-query"><p>No terms found.</p></div>';
	}

	// Handle showOnlyTopLevel.
	if ( ! empty( $query['showOnlyTopLevel'] ) ) {
		$terms = array_filter( $terms, function( $term ) {
			return empty( $term->parent );
		} );
	}

	$classnames = 'wp-block-terms-query';
	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $classnames ) );

	// Handle hierarchical list.
	$is_hierarchical = ! empty( $query['hierarchical'] );

	if ( $is_hierarchical ) {
		$content = render_hierarchical_terms( $terms, $block );
	} else {
		$content = render_flat_terms( $terms, $block );
	}

	return sprintf(
		'<div %1$s><ul>%2$s</ul></div>',
		$wrapper_attributes,
		$content
	);
}

/**
 * Renders terms in a flat list structure.
 *
 * @param array    $terms Array of WP_Term objects.
 * @param WP_Block $block Block instance.
 *
 * @return string HTML content for flat terms list.
 */
function render_flat_terms( $terms, $block ) {
	$content = '';
	foreach ( $terms as $term ) {
		$content .= render_single_term( $term, $block );
	}
	return $content;
}

/**
 * Renders terms in a hierarchical structure.
 *
 * @param array    $terms Array of WP_Term objects.
 * @param WP_Block $block Block instance.
 * @param int      $parent_id Parent term ID (0 for top-level).
 *
 * @return string HTML content for hierarchical terms list.
 */
function render_hierarchical_terms( $terms, $block, $parent_id = 0 ) {
	$content = '';

	// Filter terms for current parent.
	$child_terms = array_filter( $terms, function( $term ) use ( $parent_id ) {
		return $term->parent == $parent_id;
	} );

	foreach ( $child_terms as $term ) {
		$term_content = render_single_term( $term, $block );

		$children_content = render_hierarchical_terms( $terms, $block, $term->term_id );

		if ( ! empty( $children_content ) ) {
			$term_content = str_replace( '</li>', '<ul>' . $children_content . '</ul></li>', $term_content );
		}

		$content .= $term_content;
	}

	return $content;
}

/**
 * Renders a single term with its inner blocks.
 *
 * @param WP_Term  $term  Term object.
 * @param WP_Block $block Block instance.
 *
 * @return string HTML content for a single term.
 */
function render_single_term( $term, $block ) {
	$inner_blocks = $block->inner_blocks;
	$block_content = '';

	if ( ! empty( $inner_blocks ) ) {
		$term_id   = $term->term_id;
		$term_type = $term->taxonomy;

		$filter_block_context = static function ( $context ) use ( $term_id, $term_type ) {
			$context['termId']   = $term_id;
			$context['termType'] = $term_type;
			return $context;
		};

		add_filter( 'render_block_context', $filter_block_context, 1 );

		foreach ( $inner_blocks as $inner_block ) {
			$block_content .= $inner_block->render( array( 'dynamic' => true ) );
		}

		remove_filter( 'render_block_context', $filter_block_context, 1 );
	}

	$term_classes = implode( ' ', array( 'wp-block-term', 'term-' . $term->term_id ) );

	return '<li class="' . esc_attr( $term_classes ) . '">' . $block_content . '</li>';
}

/**
 * Registers the `core/terms-query` block on the server.
 *
 * @since 6.x.x
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
