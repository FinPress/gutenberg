<?php
/**
 * Plugin Name: Gutenberg Test Query block
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-query-block
 */

/**
 * We need to register a couple of `Query` patterns to test the
 * setup of the block and have reliable results.
 */
register_block_pattern(
	'query/test-1',
	array(
		'title'      => __( 'Query Test 1', 'gutenberg' ),
		'blockTypes' => array( 'core/query' ),
		'content'    => '<!-- fp:query {"query":{"perPage":1,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true}} -->
						<!-- fp:post-template -->
						<!-- fp:post-title {"isLink":true} /-->
						<!-- /fp:post-template -->
						<!-- /fp:query -->',
	)
);
register_block_pattern(
	'query/test-2',
	array(
		'title'      => __( 'Query Test 2', 'gutenberg' ),
		'blockTypes' => array( 'core/query' ),
		'content'    => '<!-- fp:query {"query":{"perPage":1,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true}} -->
						<!-- fp:post-template -->
						<!-- fp:post-title {"isLink":true} /-->
						<!-- fp:post-date /-->
						<!-- /fp:post-template -->
						<!-- /fp:query -->',
	)
);
