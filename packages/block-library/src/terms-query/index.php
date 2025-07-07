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

	$content = '';
	foreach ( $terms as $term ) {
		// Get an instance of the current Terms Template block.
		$block_instance = $block->parsed_block;

		// Set the block name to one that does not correspond to an existing registered block.
		// This ensures that for the inner instances of the Terms Template block, we do not render any block supports.
		$block_instance['blockName'] = 'core/null';

		$term_id   = $term->term_id;
		$term_type = $term->taxonomy;
		$filter_block_context = static function ( $context ) use ( $term_id, $term_type ) {
			$context['termType'] = $term_type;
			$context['termId']   = $term_id;
			return $context;
		};

		// Use an early priority to so that other 'render_block_context' filters have access to the values.
		add_filter( 'render_block_context', $filter_block_context, 1 );
		// Render the inner blocks of the Terms Template block with `dynamic` set to `false` to prevent calling
		// `render_callback` and ensure that no wrapper markup is included.
		$block_content = ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );
		remove_filter( 'render_block_context', $filter_block_context, 1 );

		// Wrap the render inner blocks in a `li` element with the appropriate term classes.
		$term_classes = implode( ' ', get_term_class( 'wp-block-term', $term ) );

		$content .= '<li class="' . esc_attr( $term_classes ) . '">' . $block_content . '</li>';
	}

	return sprintf(
		'<ul %1$s>%2$s</ul>',
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
