<?php
/**
 * HTML for testing the iAPI's style assets management.
 *
 * @package gutenberg-test-interactive-blocks
 *
 * @phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UndefinedVariable
 */

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'data-wp-interactive'   => 'test/router-styles',
		'data-wp-router-region' => 'router-styles',
	)
);
?>
<div <?php echo $wrapper_attributes; ?>>
	<nav data-wp-interactive="test/router-styles">
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
	<div
		data-wp-interactive="test/router-styles"
		data-wp-router-region="router-styles"
	>
		<p>Inside a router region</p>
		<?php echo $content; ?>
	</div>
</div>
