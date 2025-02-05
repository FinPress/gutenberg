<?php
/**
 * Temporary compatibility shims for block APIs present in Gutenberg.
 *
 * @package gutenberg
 */

if ( ! function_exists( 'apply_block_hooks_to_content_from_post_object' ) ) {
	/**
	 * Run the Block Hooks algorithm on a post object's content.
	 *
	 * This function is different from `apply_block_hooks_to_content` in that
	 * it takes ignored hooked block information from the post's metadata into
	 * account. This ensures that any blocks hooked as first or last child
	 * of the block that corresponds to the post type are handled correctly.
	 *
	 * @since 6.8.0
	 * @access private
	 *
	 * @param string       $content  Serialized content.
	 * @param WP_Post|null $post     A post object that the content belongs to. If set to `null`,
	 *                               `get_post()` will be called to use the current post as context.
	 *                               Default: `null`.
	 * @param callable     $callback A function that will be called for each block to generate
	 *                               the markup for a given list of blocks that are hooked to it.
	 *                               Default: 'insert_hooked_blocks'.
	 * @return string The serialized markup.
	 */
	function apply_block_hooks_to_content_from_post_object( $content, WP_Post $post = null, $callback = 'insert_hooked_blocks' ) {
		// Default to the current post if no context is provided.
		if ( null === $post ) {
			$post = get_post();
		}

		if ( ! $post instanceof WP_Post ) {
			return apply_block_hooks_to_content( $content, $post, $callback );
		}

		$attributes = array();

		// If context is a post object, `ignoredHookedBlocks` information is stored in its post meta.
		$ignored_hooked_blocks = get_post_meta( $post->ID, '_wp_ignored_hooked_blocks', true );
		if ( ! empty( $ignored_hooked_blocks ) ) {
			$ignored_hooked_blocks  = json_decode( $ignored_hooked_blocks, true );
			$attributes['metadata'] = array(
				'ignoredHookedBlocks' => $ignored_hooked_blocks,
			);
		}

		// We need to wrap the content in a temporary wrapper block with that metadata
		// so the Block Hooks algorithm can insert blocks that are hooked as first or last child
		// of the wrapper block.
		// To that end, we need to determine the wrapper block type based on the post type.
		if ( 'wp_navigation' === $post->post_type ) {
			$wrapper_block_type = 'core/navigation';
		} elseif ( 'wp_block' === $post->post_type ) {
			$wrapper_block_type = 'core/block';
		} else {
			$wrapper_block_type = 'core/post-content';
		}

		$content = get_comment_delimited_block_content(
			$wrapper_block_type,
			$attributes,
			$content
		);

		// Apply Block Hooks.
		$content = apply_block_hooks_to_content( $content, $post, $callback );

		// Finally, we need to remove the temporary wrapper block.
		$content = remove_serialized_parent_block( $content );

		return $content;
	}
	// We need to apply this filter before `do_blocks` (which is hooked to `the_content` at priority 9).
	add_filter( 'the_content', 'apply_block_hooks_to_content_from_post_object', 8 );
	// Remove apply_block_hooks_to_content filter (previously added in Core).
	remove_filter( 'the_content', 'apply_block_hooks_to_content', 8 );
}

/**
 * Hooks into the REST API response for the Posts endpoint and adds the first and last inner blocks.
 *
 * @since 6.6.0
 * @since 6.8.0 Support non-`wp_navigation` post types.
 *
 * @param WP_REST_Response $response The response object.
 * @param WP_Post          $post     Post object.
 * @return WP_REST_Response The response object.
 */
function gutenberg_insert_hooked_blocks_into_rest_response( $response, $post ) {
	if ( empty( $response->data['content']['raw'] ) ) {
		return $response;
	}

	$response->data['content']['raw'] = apply_block_hooks_to_content_from_post_object(
		$response->data['content']['raw'],
		$post,
		'insert_hooked_blocks_and_set_ignored_hooked_blocks_metadata'
	);

	// If the rendered content was previously empty, we leave it like that.
	if ( empty( $response->data['content']['rendered'] ) ) {
		return $response;
	}

	// No need to inject hooked blocks twice.
	$priority = has_filter( 'the_content', 'apply_block_hooks_to_content_from_post_object' );
	if ( false !== $priority ) {
		remove_filter( 'the_content', 'apply_block_hooks_to_content_from_post_object', $priority );
	}

	/** This filter is documented in wp-includes/post-template.php */
	$response->data['content']['rendered'] = apply_filters(
		'the_content',
		$response->data['content']['raw']
	);

	// Add back the filter.
	if ( false !== $priority ) {
		add_filter( 'the_content', 'apply_block_hooks_to_content_from_post_object', $priority );
	}

	return $response;
}
add_filter( 'rest_prepare_page', 'gutenberg_insert_hooked_blocks_into_rest_response', 10, 2 );
add_filter( 'rest_prepare_post', 'gutenberg_insert_hooked_blocks_into_rest_response', 10, 2 );
add_filter( 'rest_prepare_wp_block', 'gutenberg_insert_hooked_blocks_into_rest_response', 10, 2 );

/**
 * Updates the wp_postmeta with the list of ignored hooked blocks
 * where the inner blocks are stored as post content.
 *
 * @since 6.6.0
 * @since 6.8.0 Support other post types. (Previously, it was limited to `wp_navigation` only.)
 * @access private
 *
 * @param stdClass $post Post object.
 * @return stdClass The updated post object.
 */
function gutenberg_update_ignored_hooked_blocks_postmeta( $post ) {
	/*
	 * In this scenario the user has likely tried to create a new post object via the REST API.
	 * In which case we won't have a post ID to work with and store meta against.
	 */
	if ( empty( $post->ID ) ) {
		return $post;
	}

	/*
	 * Skip meta generation when consumers intentionally update specific fields
	 * and omit the content update.
	 */
	if ( ! isset( $post->post_content ) ) {
		return $post;
	}

	/*
	 * Skip meta generation if post type is not set.
	 */
	if ( ! isset( $post->post_type ) ) {
		return $post;
	}

	$attributes = array();

	$ignored_hooked_blocks = get_post_meta( $post->ID, '_wp_ignored_hooked_blocks', true );
	if ( ! empty( $ignored_hooked_blocks ) ) {
		$ignored_hooked_blocks  = json_decode( $ignored_hooked_blocks, true );
		$attributes['metadata'] = array(
			'ignoredHookedBlocks' => $ignored_hooked_blocks,
		);
	}

	if ( 'wp_navigation' === $post->post_type ) {
		$wrapper_block_type = 'core/navigation';
	} elseif ( 'wp_block' === $post->post_type ) {
		$wrapper_block_type = 'core/block';
	} else {
		$wrapper_block_type = 'core/post-content';
	}

	$markup = get_comment_delimited_block_content(
		$wrapper_block_type,
		$attributes,
		$post->post_content
	);

	$existing_post = get_post( $post->ID );
	// Merge the existing post object with the updated post object to pass to the block hooks algorithm for context.
	$context          = (object) array_merge( (array) $existing_post, (array) $post );
	$context          = new WP_Post( $context ); // Convert to WP_Post object.
	$serialized_block = apply_block_hooks_to_content( $markup, $context, 'set_ignored_hooked_blocks_metadata' );
	$root_block       = parse_blocks( $serialized_block )[0];

	$ignored_hooked_blocks = isset( $root_block['attrs']['metadata']['ignoredHookedBlocks'] )
		? $root_block['attrs']['metadata']['ignoredHookedBlocks']
		: array();

	if ( ! empty( $ignored_hooked_blocks ) ) {
		$existing_ignored_hooked_blocks = get_post_meta( $post->ID, '_wp_ignored_hooked_blocks', true );
		if ( ! empty( $existing_ignored_hooked_blocks ) ) {
			$existing_ignored_hooked_blocks = json_decode( $existing_ignored_hooked_blocks, true );
			$ignored_hooked_blocks          = array_unique( array_merge( $ignored_hooked_blocks, $existing_ignored_hooked_blocks ) );
		}

		if ( ! isset( $post->meta_input ) ) {
			$post->meta_input = array();
		}
		$post->meta_input['_wp_ignored_hooked_blocks'] = json_encode( $ignored_hooked_blocks );
	}

	$post->post_content = remove_serialized_parent_block( $serialized_block );
	return $post;
}
add_filter( 'rest_pre_insert_page', 'gutenberg_update_ignored_hooked_blocks_postmeta' );
add_filter( 'rest_pre_insert_post', 'gutenberg_update_ignored_hooked_blocks_postmeta' );
add_filter( 'rest_pre_insert_wp_block', 'gutenberg_update_ignored_hooked_blocks_postmeta' );

/**
 * Adds 'post_ancestor' attribute to the query for the query block.
 * 'post_ancestor' is a page_id used to get all descendents of the corresponding
 * page.  Unlike `post_parent` which only gets the direct children.
 *
 * @param array    $query The query vars.
 * @param WP_Block $block Block instance.
 * @return array   The filtered query vars.
 */
function gutenberg_show_descendents_query_vars_from_query_block( $query, $block ) {
	if ( ! empty( $block->context['query']['ancestor'] ) && is_post_type_hierarchical( $query['post_type'] ) ) {
		$query['post_ancestor'] = intval( $block->context['query']['ancestor'] );

		/**
		 * To get all descendents of a particular page, we need the
		 * query to return all pages so we can later filter them
		 * using get_child_pages.
		 */
		if ( $query['post_ancestor'] ) {
			$query['post_parent__in'] = array();
		}
	}

	return $query;
}
add_filter( 'query_loop_block_query_vars', 'gutenberg_show_descendents_query_vars_from_query_block', 10, 2 );

/**
 * If the query vars post_ancestor attribute has been set, then the LIMIT part
 * of the SQL query is removed.  This is because we need all the pages from
 * the database so we can pass them through get_page_children.
 *
 * @param [type] $limits The LIMIT clause of the query.
 * @param [type] $query The WP_Query instance
 * @return void The filtered LIMIT clause of the query.
 */
function gutenberg_remove_limit_from_query_if_ancestor( $limits, $query ) {
	$query_vars = $query->query_vars;
	if ( empty( $query_vars['post_ancestor'] ) || ! is_int( $query_vars['post_ancestor'] ) || $query_vars['post_ancestor'] <= 0 ) {
		return $limits;
	}

	return '';
}

add_filter( 'post_limits_request', 'gutenberg_remove_limit_from_query_if_ancestor', 10, 2 );

/**
 * Filters the results from a post query to get all descendents of a page
 * with a particular page id.
 *
 * @param array    $pages The array of pages returned from the query.
 * @param WP_Query $query The query object.
 * @return array   The filtered array of pages.
 */
function gutenberg_get_all_descendents( $pages, $query ) {
	$query_vars = $query->query_vars;
	if ( empty( $query_vars['post_ancestor'] ) || ! is_int( $query_vars['post_ancestor'] ) || $query_vars['post_ancestor'] <= 0 ) {
		return $pages;
	}

	return get_page_children( $query_vars['post_ancestor'], $pages );
}
add_filter( 'posts_results', 'gutenberg_get_all_descendents', 10, 2 );
