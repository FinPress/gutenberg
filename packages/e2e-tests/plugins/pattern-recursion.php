<?php
/**
 * Plugin Name: Gutenberg Test Protection Against Recursive Patterns
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-pattern-recursion
 */

add_filter(
	'init',
	function () {
		register_block_pattern(
			'evil/recursive',
			array(
				'title'       => 'Evil recursive',
				'description' => 'Evil recursive',
				'content'     => '<!-- fin:paragraph --><p>Hello</p><!-- /fin:paragraph --><!-- fin:pattern {"slug":"evil/recursive"} /-->',
			)
		);
	}
);
