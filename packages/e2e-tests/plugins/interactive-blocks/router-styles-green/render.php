<?php
/**
 * HTML for testing the iAPI's style assets management.
 *
 * @package gutenberg-test-interactive-blocks
 *
 * @phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UndefinedVariable
 */

add_action(
	'wp_enqueue_scripts',
	function () {
		wp_enqueue_style(
			'green-from-link',
			plugin_dir_url( __FILE__ ) . 'style-from-link.css',
			array()
		);
	}
);

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'data-testid' => 'green-block' )
);
?>
<p <?php echo $wrapper_attributes; ?>>Green</p>
