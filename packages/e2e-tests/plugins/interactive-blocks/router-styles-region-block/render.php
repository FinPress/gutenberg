<?php
/**
 * HTML for testing the iAPI's style assets management.
 *
 * @package gutenberg-test-interactive-blocks
 *
 * @phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UndefinedVariable
 */

$wrapper_attributes = get_block_wrapper_attributes();
?>
<div <?php echo $wrapper_attributes; ?>>
	<!-- Interactive HTML NOT updated on navigation -->
	<div data-wp-interactive="test/router-styles">
		<div
			data-testid="counter"
			data-wp-text="state.navigationCount"
		></div>
		<nav>
			<?php foreach ( $attributes['links'] as $label => $link ) : ?>
				<a
					data-testid="link <?php echo $label; ?>"
					data-wp-on--click="actions.navigate"
					href="<?php echo $link; ?>"
				>
					<?php echo $label; ?>
				</a>
			<?php endforeach; ?>
		</nav>
	</div>
	<!-- HTML updated on navigation. -->
	<div
		data-wp-interactive="test/router-styles"
		data-wp-router-region="router-styles"
	>
		<p>Inside a router region</p>
		<?php echo $content; ?>
	</div>
</div>
