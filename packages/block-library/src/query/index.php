<?php

/**
 * Server-side rendering of the `core/query` block.
 *
 * @package WordPress
 */

/** Determines whether we have no results
 *
 * @since 6.9.0
 *
 * @param array    $attributes Block attributes.
 * @param WP_Block $block      The block instance.
 * @return bool Returns true if the query has results, false otherwise.
 */
function block_core_query_has_results( $attributes, $block ) {
	$page_key         = isset( $attributes['queryId'] ) ? 'query-' . $attributes['queryId'] . '-page' : 'query-page';
	$page             = empty( $_GET[ $page_key ] ) ? 1 : (int) $_GET[ $page_key ];
	$use_global_query = ( isset( $attributes['query']['inherit'] ) && $attributes['query']['inherit'] );
	if ( $use_global_query ) {
		global $wp_query;

		/*
		 * If already in the main query loop, duplicate the query instance to not tamper with the main instance.
		 * Since this is a nested query, it should start at the beginning, therefore rewind posts.
		 * Otherwise, the main query loop has not started yet and this block is responsible for doing so.
		 */
		if ( in_the_loop() ) {
			$query = clone $wp_query;
			$query->rewind_posts();
		} else {
			$query = $wp_query;
		}
	} else {
		$query_args = build_query_vars_from_query_block( $block, $page );
		$query      = new WP_Query( $query_args );
	}

	return $query->have_posts();
}

/**
 * Checks if the block has a no results block
 *
 * @param WP_Block $block The block instance.
 * @return bool Returns true if the block has a no results block, false otherwise.
 */
function has_no_results_block( $block ) {
	if ( empty( $block['innerBlocks'] ) ) {
		return false;
	}

	foreach ( $block['innerBlocks'] as $inner_block ) {
		// Check if this inner block is the no-results block
		if ( $inner_block['blockName'] === 'core/query-no-results' ) {
			return true;
		}

		// Recursively check this inner block's children
		if ( has_no_results_block( $inner_block ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Modifies the static `core/query` block on the server.
 *
 * @since 6.4.0
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      The block instance.
 *
 * @return string Returns the modified output of the query block.
 */
function render_block_core_query( $attributes, $content, $block ) {
	$is_interactive = isset( $attributes['enhancedPagination'] )
		&& true === $attributes['enhancedPagination']
		&& isset( $attributes['queryId'] );

	// Enqueue the script module and add the necessary directives if the block is
	// interactive.
	if ( $is_interactive ) {
		wp_enqueue_script_module( '@wordpress/block-library/query/view' );

		$p = new WP_HTML_Tag_Processor( $content );
		if ( $p->next_tag() ) {
			// Add the necessary directives.
			$p->set_attribute( 'data-wp-interactive', 'core/query' );
			$p->set_attribute( 'data-wp-router-region', 'query-' . $attributes['queryId'] );
			$p->set_attribute( 'data-wp-context', '{}' );
			$p->set_attribute( 'data-wp-key', $attributes['queryId'] );
			$content = $p->get_updated_html();
		}
	}

	// Add the styles to the block type if the block is interactive and remove
	// them if it's not.
	$style_asset = 'wp-block-query';
	if ( ! wp_style_is( $style_asset ) ) {
		$style_handles = $block->block_type->style_handles;
		// If the styles are not needed, and they are still in the `style_handles`, remove them.
		if ( ! $is_interactive && in_array( $style_asset, $style_handles, true ) ) {
			$block->block_type->style_handles = array_diff( $style_handles, array( $style_asset ) );
		}
		// If the styles are needed, but they were previously removed, add them again.
		if ( $is_interactive && ! in_array( $style_asset, $style_handles, true ) ) {
			$block->block_type->style_handles = array_merge( $style_handles, array( $style_asset ) );
		}
	}

	return $content;
}

/**
 * Registers the `core/query` block on the server.
 *
 * @since 5.8.0
 */
function register_block_core_query() {
	register_block_type_from_metadata(
		__DIR__ . '/query',
		array(
			'render_callback' => 'render_block_core_query',
		)
	);
}
add_action( 'init', 'register_block_core_query' );

/**
 * Traverse the tree of blocks looking for any plugin block (i.e., a block from
 * an installed plugin) inside a Query block with the enhanced pagination
 * enabled. If at least one is found, the enhanced pagination is effectively
 * disabled to prevent any potential incompatibilities.
 *
 * @since 6.4.0
 *
 * @param array $parsed_block The block being rendered.
 * @return array Returns the parsed block, unmodified.
 */
function block_core_query_disable_enhanced_pagination( $parsed_block ) {
	static $enhanced_query_stack   = array();
	static $dirty_enhanced_queries = array();
	static $render_query_callback  = null;

	$block_name              = $parsed_block['blockName'];
	$block_type              = WP_Block_Type_Registry::get_instance()->get_registered( $block_name );
	$has_enhanced_pagination = isset( $parsed_block['attrs']['enhancedPagination'] ) && true === $parsed_block['attrs']['enhancedPagination'] && isset( $parsed_block['attrs']['queryId'] );
	/*
	 * Client side navigation can be true in two states:
	 *  - supports.interactivity = true;
	 *  - supports.interactivity.clientNavigation = true;
	 */
	$supports_client_navigation = ( isset( $block_type->supports['interactivity']['clientNavigation'] ) && true === $block_type->supports['interactivity']['clientNavigation'] )
		|| ( isset( $block_type->supports['interactivity'] ) && true === $block_type->supports['interactivity'] );

	if ( 'core/query' === $block_name && $has_enhanced_pagination ) {
		$enhanced_query_stack[] = $parsed_block['attrs']['queryId'];

		if ( ! isset( $render_query_callback ) ) {
			/**
			 * Filter that disables the enhanced pagination feature during block
			 * rendering when a plugin block has been found inside. It does so
			 * by adding an attribute called `data-wp-navigation-disabled` which
			 * is later handled by the front-end logic.
			 *
			 * @param string   $content  The block content.
			 * @param array    $block    The full block, including name and attributes.
			 * @return string Returns the modified output of the query block.
			 */
			$render_query_callback = static function ( $content, $block ) use ( &$enhanced_query_stack, &$dirty_enhanced_queries, &$render_query_callback ) {
				$has_enhanced_pagination = isset( $block['attrs']['enhancedPagination'] ) && true === $block['attrs']['enhancedPagination'] && isset( $block['attrs']['queryId'] );

				if ( ! $has_enhanced_pagination ) {
					return $content;
				}

				if ( isset( $dirty_enhanced_queries[ $block['attrs']['queryId'] ] ) ) {
					// Disable navigation in the router store config.
					wp_interactivity_config( 'core/router', array( 'clientNavigationDisabled' => true ) );
					$dirty_enhanced_queries[ $block['attrs']['queryId'] ] = null;
				}

				array_pop( $enhanced_query_stack );

				if ( empty( $enhanced_query_stack ) ) {
					remove_filter( 'render_block_core/query', $render_query_callback );
					$render_query_callback = null;
				}

				return $content;
			};

			add_filter( 'render_block_core/query', $render_query_callback, 10, 2 );
		}
	} elseif (
		! empty( $enhanced_query_stack ) &&
		isset( $block_name ) &&
		( ! $supports_client_navigation )
	) {
		foreach ( $enhanced_query_stack as $query_id ) {
			$dirty_enhanced_queries[ $query_id ] = true;
		}
	}

	return $parsed_block;
}

add_filter( 'render_block_data', 'block_core_query_disable_enhanced_pagination', 10, 1 );

/**
 * Adds a query no results block to a query block.
 *
 * @since 6.9.0
 *
 * @param array $parsed_block The block being rendered.
 * @return array The modified block.
 */
function block_core_query_add_no_results_block( $parsed_block ) {
	if ( $parsed_block['blockName'] !== 'core/query' ) {
		return $parsed_block;
	}

	// Check if we already have a no results block
	if ( has_no_results_block( $parsed_block ) ) {
		return $parsed_block;
	}

	if ( block_core_query_has_results( $parsed_block['attrs'], $parsed_block ) ) {
		return $parsed_block;
	}

	// Create the no results block structure
	$no_results_block = array(
		'blockName'    => 'core/query-no-results',
		'attrs'        => array(),
		'innerBlocks'  => array(
			array(
				'blockName'    => 'core/paragraph',
				'attrs'        => array(
					'placeholder' => __( 'Add text or blocks that will display when a query returns no results.' ),
				),
				'innerHTML'    => '<p>' . __( 'No posts were found.' ) . '</p>',
				'innerContent' => array( '<p>' . __( 'No posts were found.' ) . '</p>' ),
			),
		),
		'innerHTML'    => "\n\n",
		'innerContent' => array( "\n", null, "\n" ),
	);

	//var_dump($parsed_block['innerBlocks'][0]['innerBlocks']);
	$parsed_block['innerBlocks'][] = $no_results_block;

	// Update the innerContent array to include the new block
	if ( ! isset( $parsed_block['innerContent'] ) ) {
		$parsed_block['innerContent'] = array();
	}
	$parsed_block['innerContent'][] = null; // Add a placeholder for the new block

	return $parsed_block;
}

add_filter( 'render_block_data', 'block_core_query_add_no_results_block', 20, 1 );
