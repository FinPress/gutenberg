<?php
/**
 * HTML for testing the iAPI's style assets management.
 *
 * @package gutenberg-test-interactive-blocks
 *
 * @phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UndefinedVariable
 */

add_action(
	'fp_enqueue_scripts',
	function () {
		fp_enqueue_style(
			'red-from-link',
			plugin_dir_url( __FILE__ ) . 'style-from-link.css',
			array()
		);

		$custom_css = '
			.red-from-inline {
				color: rgb(255, 0, 0);
			}
		';

		fp_register_style( 'test-router-styles', false );
		fp_enqueue_style( 'test-router-styles' );
		fp_add_inline_style( 'test-router-styles', $custom_css );
	}
);

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'data-testid' => 'red-block' )
);
?>
<p <?php echo $wrapper_attributes; ?>>Red</p>

<noscript>
	<style>
		.noscript-style-test {
			color: rgb(255, 0, 0) !important;
			font-weight: bold !important;
		}
	</style>
</noscript>
