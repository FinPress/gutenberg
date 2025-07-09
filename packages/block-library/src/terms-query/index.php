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
	$query = $block->context['query'] ?? array();

	// Default to current term if on a term archive, otherwise default to categories.
	if ( empty( $query['taxonomy'] ) || ( isset( $query['taxonomy'] ) && $query['taxonomy'] === 'category' && empty( $query['include'] ) ) ) {
		if ( is_category() || is_tag() || is_tax() ) {
			$term = get_queried_object();
			if ( $term && ! is_wp_error( $term ) && isset( $term->term_id ) && isset( $term->taxonomy ) ) {
				// Update the query to use the current term
				$query['taxonomy'] = $term->taxonomy;
				$query['include'] = array( $term->term_id );
			}
		}
	}

	$query_args = array(
		'taxonomy'   => $query['taxonomy'] ?? 'category',
		'offset'     => $query['offset'] ?? 0,
		'order'      => $query['order'] ?? 'asc',
		'orderby'    => $query['orderBy'] ?? 'name',
		'hide_empty' => $query['hideEmpty'] ?? false,
		'hierarchical' => $query['hierarchical'] ?? false,
		'parent'     => $query['parent'] ?? 0,
		'exclude'    => $query['exclude'] ?? array(),
		'include'    => $query['include'] ?? array(),
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

	$terms_html = '';
	foreach ( $terms as $term ) {
		$term_link  = get_term_link( $term );
		$term_name  = $term->name;
		$term_count = $term->count;
		$is_link    = $query['isLink'] ?? false;

		if ( $is_link && ! is_wp_error( $term_link ) ) {
			$terms_html .= sprintf(
				'<li class="wp-block-term term-%d">
					<a href="%s" class="wp-block-term-link">
						<span class="wp-block-term-name">%s</span>
						<span class="wp-block-term-count">%d</span>
					</a>
				</li>',
				$term->term_id,
				esc_url( $term_link ),
				esc_html( $term_name ),
				$term_count
			);
		} else {
			$terms_html .= sprintf(
				'<li class="wp-block-term term-%d">
					<span class="wp-block-term-name">%s</span>
					<span class="wp-block-term-count">%d</span>
				</li>',
				$term->term_id,
				esc_html( $term_name ),
				$term_count
			);
		}
	}

	return sprintf(
		'<div class="%s"><ul>%s</ul></div>',
		esc_attr( $classnames ),
		$terms_html
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
