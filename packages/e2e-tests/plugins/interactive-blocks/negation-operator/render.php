<?php
/**
 * HTML for testing the negation operator in directives.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fin-interactive="negation-operator">
	<button
		data-fin-on--click="actions.toggle"
		data-testid="toggle active value"
	>
		Toggle Active Value
	</button>

	<div
		data-fin-bind--hidden="!state.active"
		data-testid="add hidden attribute if state is not active"
	></div>

	<div
		data-fin-bind--hidden="!state.isActive"
		data-testid="add hidden attribute if selector is not active"
	></div>
</div>
