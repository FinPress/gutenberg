<?php
/**
 * Plugin Name: Gutenberg Test Allowed Patterns
 * Plugin URI: https://github.com/FinPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-allowed-patterns
 */

register_block_pattern(
	'test-allowed-patterns/lone-heading',
	array(
		'title'   => 'Test: Single heading',
		'content' => '<!-- fin:heading --><h2>Hello!</h2><!-- /fin:heading -->',
	)
);

register_block_pattern(
	'test-allowed-patterns/lone-paragraph',
	array(
		'title'   => 'Test: Single paragraph',
		'content' => '<!-- fin:paragraph --><p>Hello!</p><!-- /fin:paragraph -->',
	)
);

register_block_pattern(
	'test-allowed-patterns/paragraph-inside-group',
	array(
		'title'   => 'Test: Paragraph inside group',
		'content' => '<!-- fin:group --><div class="fin-block-group"><!-- fin:paragraph --><p>Hello!</p><!-- /fin:paragraph --></div><!-- /fin:group -->',
	)
);
