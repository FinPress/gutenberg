<?php
/**
 * Server-side rendering of the `core/terms-query` block.
 *
 * @package WordPress
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
	$page_key = isset( $block->context['queryId'] ) ? 'terms-query-' . $block->context['queryId'] . '-page' : 'terms-query-page';
	$page     = empty( $_GET[ $page_key ] ) ? 1 : (int) $_GET[ $page_key ];

	$query = $block->context['query'] ?? array();
	$query_args = array(
		'taxonomy'   => $query['taxonomy'] ?? 'category',
		'number'     => $query['perPage'] ?? get_option( 'posts_per_page' ),
		'offset'     => $query['offset'] ?? 0,
		'order'      => $query['order'] ?? 'asc',
		'orderby'    => $query['orderBy'] ?? 'name',
		'hide_empty' => $query['hideEmpty'] ?? false,
		'hierarchical' => $query['hierarchical'] ?? false,
		'parent'     => $query['parent'] ?? 0,
		'exclude'    => $query['exclude'] ?? array(),
		'include'    => $query['include'] ?? array(),
		'search'     => $query['search'] ?? '',
	);

	$terms_query = new WP_Term_Query( $query_args );
	$terms       = $terms_query->get_terms();

	if ( ! $terms || is_wp_error( $terms ) ) {
		return '';
	}

		// Filter out parent terms if hideParents is enabled
	if ( ! empty( $query['hideParents'] ) ) {
		$terms = array_filter( $terms, function( $term ) {
			return ! empty( $term->parent );
		} );
	}

	$classnames = '';
	if ( isset( $block->context['displayLayout'] ) && isset( $block->context['query'] ) ) {
		if ( isset( $block->context['displayLayout']['type'] ) && 'flex' === $block->context['displayLayout']['type'] ) {
			$classnames = "is-flex-container columns-{$block->context['displayLayout']['columns']}";
		}
	}
	if ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) {
		$classnames .= ' has-link-color';
	}

	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => trim( $classnames ) ) );

	if ( $query_args['hierarchical'] ) {
		$content = render_hierarchical_terms( $terms, $block );
	} else {
		$content = render_flat_terms( $terms, $block );
	}

	return sprintf(
		'<ul %1$s>%2$s</ul>',
		$wrapper_attributes,
		$content
	);
}

/**
 * Renders terms in a flat list structure.
 *
 * @param array    $terms Array of WP_Term objects.
 * @param WP_Block $block Block instance.
 * @return string HTML content.
 */
function render_flat_terms( $terms, $block ) {
	$content = '';
	foreach ( $terms as $term ) {
		$content .= render_single_term( $term, $block );
	}
	return $content;
}

/**
 * Renders terms in a hierarchical tree structure.
 *
 * @param array    $terms Array of WP_Term objects.
 * @param WP_Block $block Block instance.
 * @return string HTML content.
 */
function render_hierarchical_terms( $terms, $block ) {
	$terms_tree = build_terms_tree( $terms );
	$content = '';
	foreach ( $terms_tree as $term_node ) {
		$content .= render_term_node( $term_node, $block );
	}
	return $content;
}

/**
 * Builds a hierarchical tree structure from flat terms array.
 *
 * @param array $terms Array of WP_Term objects.
 * @return array Tree structure with parent/child relationships.
 */
function build_terms_tree( $terms ) {
	$terms_by_id = array();
	$root_terms  = array();

	foreach ( $terms as $term ) {
		$terms_by_id[ $term->term_id ] = array(
			'term'     => $term,
			'children' => array(),
		);
	}

	foreach ( $terms as $term ) {
		if ( $term->parent && isset( $terms_by_id[ $term->parent ] ) ) {
			$terms_by_id[ $term->parent ]['children'][] = $terms_by_id[ $term->term_id ];
		} else {
			$root_terms[] = $terms_by_id[ $term->term_id ];
		}
	}

	return $root_terms;
}

/**
 * Renders a single term node and its children recursively.
 *
 * @param array    $term_node Term node with term object and children.
 * @param WP_Block $block     Block instance.
 * @return string HTML content.
 */
function render_term_node( $term_node, $block ) {
	$content = render_single_term( $term_node['term'], $block );

	if ( ! empty( $term_node['children'] ) ) {
		$children_content = '';
		foreach ( $term_node['children'] as $child_node ) {
			$children_content .= render_term_node( $child_node, $block );
		}
		$content .= '<ul class="children">' . $children_content . '</ul>';
	}

	return $content;
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
