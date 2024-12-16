<?php
/**
 * HTML for testing the iAPI's style assets management.
 *
 * @package gutenberg-test-interactive-blocks
 *
 * @phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UndefinedVariable
 */

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'data-testid' => 'blue-block' )
);
?>
<p <?php echo $wrapper_attributes; ?>>Blue</p>
