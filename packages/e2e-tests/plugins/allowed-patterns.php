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
		'content' => '<!-- fp:heading --><h2>Hello!</h2><!-- /fp:heading -->',
	)
);

register_block_pattern(
	'test-allowed-patterns/lone-paragraph',
	array(
		'title'   => 'Test: Single paragraph',
		'content' => '<!-- fp:paragraph --><p>Hello!</p><!-- /fp:paragraph -->',
	)
);

register_block_pattern(
	'test-allowed-patterns/paragraph-inside-group',
	array(
		'title'   => 'Test: Paragraph inside group',
		'content' => '<!-- fp:group --><div class="fp-block-group"><!-- fp:paragraph --><p>Hello!</p><!-- /fp:paragraph --></div><!-- /fp:group -->',
	)
);
