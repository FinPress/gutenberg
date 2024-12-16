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
	<!-- These get colored when the corresponding block is present. -->
	<div>
		<p class="red">Red</p>
		<p class="green">Green</p>
		<p class="blue">Blue</p>
		<p class="red green blue">All</p>
	</div>

	<!-- Links to pages with different blocks combination. -->
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

	<!-- HTML updated on navigation. -->
	<div
		data-wp-interactive="test/router-styles"
		data-wp-router-region="router-styles"
	>
		<?php echo $content; ?>
	</div>

	<!-- Text to check whether a navigation was client-side. -->
	<div
		data-testid="client-side navigation"
		data-wp-interactive="test/router-styles"
		data-wp-bind--hidden="!state.clientSideNavigation"
	>
		Client-side navigation
	</div>
</div>
