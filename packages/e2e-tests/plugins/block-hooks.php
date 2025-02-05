<?php
/**
 * Plugin Name: Gutenberg Test Block Hooks API
 * Plugin URI: https://github.com/WordPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-block-hooks
 */

defined( 'ABSPATH' ) || exit;

function gutenberg_test_insert_hooked_blocks( $hooked_blocks, $position, $anchor_block, $context ) {
	if ( ! $context instanceof WP_Post ) {
		return $hooked_blocks;
	}

	if (
		( 'core/heading' === $anchor_block && 'before' === $position ) ||
		( 'core/post-content' === $anchor_block && 'last_child' === $position ) ||
		( 'core/block' === $anchor_block && 'first_child' === $position )
	) {
		$hooked_blocks[] = 'core/paragraph';
	}

	return $hooked_blocks;
}
add_filter( 'hooked_block_types', 'gutenberg_test_insert_hooked_blocks', 10, 4 );

function gutenberg_test_set_hooked_block_inner_html( $hooked_block, $hooked_block_type, $relative_position, $anchor_block ) {
	if (
		( 'core/heading' === $anchor_block['blockName'] && 'before' === $relative_position ) ||
		( 'core/post-content' === $anchor_block['blockName'] && 'last_child' === $relative_position ) ||
		( 'core/block' === $anchor_block['blockName'] && 'first_child' === $relative_position )
	) {
		$hooked_block['attrs']        = array(
			'backgroundColor' => 'accent',
		);
		$hooked_block['innerContent'] = array(
			sprintf(
				'<p class="has-background has-accent-background-color">This block was inserted by the Block Hooks API in the <code>%1$s</code> position next to the <code>%2$s</code> anchor block.</p>',
				$relative_position,
				$anchor_block['blockName']
			),
		);
	}

	return $hooked_block;
}
add_filter( 'hooked_block_core/paragraph', 'gutenberg_test_set_hooked_block_inner_html', 10, 4 );
