<?php
/**
 * Temporary compatibility shims for block APIs present in Gutenberg.
 *
 * @package gutenberg
 */

/**
 * Filters the block type arguments during registration to stabilize experimental block supports.
 *
 * This is a temporary compatibility shim as the approach in core is for this to be handled
 * within the WP_Block_Type class rather than requiring a filter.
 *
 * @param array $args Array of arguments for registering a block type.
 * @return array Array of arguments for registering a block type.
 */
function gutenberg_stabilize_experimental_block_supports( $args ) {
	if ( empty( $args['supports']['typography'] ) ) {
		return $args;
	}

	$experimental_typography_supports_to_stable = array(
		'__experimentalFontFamily'     => 'fontFamily',
		'__experimentalFontStyle'      => 'fontStyle',
		'__experimentalFontWeight'     => 'fontWeight',
		'__experimentalLetterSpacing'  => 'letterSpacing',
		'__experimentalTextDecoration' => 'textDecoration',
		'__experimentalTextTransform'  => 'textTransform',
	);

	$current_typography_supports = $args['supports']['typography'];
	$stable_typography_supports  = array();

	foreach ( $current_typography_supports as $key => $value ) {
		if ( array_key_exists( $key, $experimental_typography_supports_to_stable ) ) {
			$stable_typography_supports[ $experimental_typography_supports_to_stable[ $key ] ] = $value;
		} else {
			$stable_typography_supports[ $key ] = $value;
		}
	}

	$args['supports']['typography'] = $stable_typography_supports;

	return $args;
}

add_filter( 'register_block_type_args', 'gutenberg_stabilize_experimental_block_supports', PHP_INT_MAX, 1 );

/**
 * Adds `ignore` option for sticky posts to the Query block.
 *
 * @see 'query_loop_block_query_vars'
 *
 * @param array    $query The query vars.
 * @param WP_Block $block Block instance.
 * @return array   The filtered query vars.
 */
function gutenberg_add_ignore_sticky_posts_to_query_loop_block( $query, $block ) {
	if ( ! empty( $block->context['query']['sticky'] ) && 'ignore' === $block->context['query']['sticky'] ) {
		// Core function excludes all sticky posts if the `sticky` value is anything
		// other than `only`. We must reset that here, but it could potentially also
		// re-allow a sticky post that had been excluded in some other way. This 
		// works okay for testing, but the real fix will need to be in the
		// core function.
		$sticky = get_option( 'sticky_posts' );

		$query['post__not_in'] = array_diff( $query['post__not_in'], ! empty( $sticky ) ? $sticky : array() );

		// Ignore sticky posts.
		$query['ignore_sticky_posts'] = 1;
	}

	return $query;
}
add_filter( 'query_loop_block_query_vars', 'gutenberg_add_ignore_sticky_posts_to_query_loop_block', 10, 2 );
