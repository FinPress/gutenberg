<?php
/**
 * HTML for testing the negation operator in directives.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fp-interactive="negation-operator">
	<button
		data-fp-on--click="actions.toggle"
		data-testid="toggle active value"
	>
		Toggle Active Value
	</button>

	<div
		data-fp-bind--hidden="!state.active"
		data-testid="add hidden attribute if state is not active"
	></div>

	<div
		data-fp-bind--hidden="!state.isActive"
		data-testid="add hidden attribute if selector is not active"
	></div>
</div>
