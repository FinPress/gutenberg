<?php
/**
 * Server-side rendering of the `core/terms-template` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/terms-template` block on the server.
 *
 * @since 6.x.x
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 *
 * @return string Returns the output of the terms template.
 */
function render_block_core_terms_template( $attributes, $content, $block ) {
	$query_block_context = $block->context;

	if ( empty( $query_block_context['query'] ) ) {
		return '';
	}

	$query = $query_block_context['query'];

	$query_args = array(
		'taxonomy'     => $query['taxonomy'] ?? 'category',
		'order'        => $query['order'] ?? 'asc',
		'orderby'      => $query['orderBy'] ?? 'name',
		'hide_empty'   => $query['hideEmpty'] ?? true,
		'hierarchical' => $query['hierarchical'] ?? false,
	);

	$terms_query = new WP_Term_Query( $query_args );
	$terms       = $terms_query->get_terms();

	if ( ! $terms || is_wp_error( $terms ) ) {
		return '';
	}

	// Handle showOnlyTopLevel.
	if ( ! empty( $query['showOnlyTopLevel'] ) ) {
		$terms = array_filter(
			$terms,
			function ( $term ) {
				return empty( $term->parent );
			}
		);
	}

	// Check if we have terms after filtering.
	if ( empty( $terms ) ) {
		return '';
	}

	// Handle hierarchical list.
	$is_hierarchical = ! empty( $query['hierarchical'] );

	if ( $is_hierarchical ) {
		$content = render_block_core_terms_template_hierarchical( $terms, $block );
	} else {
		$content = render_block_core_terms_template_flat( $terms, $block );
	}

	return sprintf(
		'<ul>%s</ul>',
		$content
	);
}

/**
 * Renders terms in a flat list structure.
 *
 * @since 6.x.x
 *
 * @param array    $terms Array of WP_Term objects.
 * @param WP_Block $block Block instance.
 *
 * @return string HTML content for flat terms list.
 */
function render_block_core_terms_template_flat( $terms, $block ) {
	$content = '';
	foreach ( $terms as $term ) {
		$content .= render_block_core_terms_template_single( $term, $block );
	}
	return $content;
}

/**
 * Renders terms in a hierarchical structure.
 *
 * @since 6.x.x
 *
 * @param array    $terms Array of WP_Term objects.
 * @param WP_Block $block Block instance.
 * @param int      $parent_id Parent term ID (0 for top-level).
 *
 * @return string HTML content for hierarchical terms list.
 */
function render_block_core_terms_template_hierarchical( $terms, $block, $parent_id = 0 ) {
	$content = '';

	// Filter terms for current parent.
	$child_terms = array_filter(
		$terms,
		function ( $term ) use ( $parent_id ) {
			return $term->parent === $parent_id;
		}
	);

	foreach ( $child_terms as $term ) {
		$term_content = render_block_core_terms_template_single( $term, $block );

		$children_content = render_block_core_terms_template_hierarchical( $terms, $block, $term->term_id );

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
 * @since 6.x.x
 *
 * @param WP_Term  $term  Term object.
 * @param WP_Block $block Block instance.
 *
 * @return string HTML content for a single term.
 */
function render_block_core_terms_template_single( $term, $block ) {
	$inner_blocks  = $block->inner_blocks;
	$block_content = '';

	if ( ! empty( $inner_blocks ) ) {
		$term_id   = $term->term_id;
		$term_type = $term->taxonomy;

		foreach ( $inner_blocks as $inner_block ) {
			$inner_block->context['termId']   = $term_id;
			$inner_block->context['termType'] = $term_type;

			$block_content .= $inner_block->render( array( 'dynamic' => true ) );
		}
	}

	$term_classes = implode( ' ', array( 'wp-block-term', 'term-' . $term->term_id ) );

	return '<li class="' . esc_attr( $term_classes ) . '">' . $block_content . '</li>';
}

/**
 * Registers the `core/terms-template` block on the server.
 *
 * @since 6.x.x
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
