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
		( $anchor_block === 'core/heading' && $position === 'before' ) ||
		( $anchor_block === 'core/post-content' && $position === 'last_child' ) ||
		( $anchor_block === 'core/block' && $position === 'first_child' )
	) {
		$hooked_blocks[] = 'core/paragraph';
	}

	 return $hooked_blocks;
}
add_filter( 'hooked_block_types', 'gutenberg_test_insert_hooked_blocks', 10, 4 );

function gutenberg_test_set_hooked_block_inner_html( $hooked_block, $hooked_block_type, $relative_position, $anchor_block ) {
	if (
		( $anchor_block['blockName'] === 'core/heading' && 'before' === $relative_position ) ||
		( $anchor_block['blockName'] === 'core/post-content' && 'last_child' === $relative_position ) ||
		( $anchor_block['blockName'] === 'core/block' && 'first_child' === $relative_position )
	) {
		$hooked_block['attrs'] = array(
			'backgroundColor' => 'accent',
		);
		$hooked_block['innerContent'] = array(
			sprintf(
				'<p class="has-background has-accent-background-color">This block was inserted by the Block Hooks API in the <code>%1$s</code> position next to the <code>%2$s</code> anchor block.</p>',
				$relative_position,
				$anchor_block['blockName']
			)
		);
	}

	return $hooked_block;
}
add_filter( 'hooked_block_core/paragraph', 'gutenberg_test_set_hooked_block_inner_html', 10, 4 );
