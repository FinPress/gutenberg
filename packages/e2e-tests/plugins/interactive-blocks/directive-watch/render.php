<?php
/**
 * HTML for testing the directive `data-fin-watch`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fin-interactive="directive-watch">
	<div data-fin-show-mock="state.isOpen">
		<input
			data-testid="input"
			data-fin-watch="callbacks.elementAddedToTheDOM"
		/>
	</div>

	<div
		data-fin-text="state.elementInTheDOM"
		data-testid="element in the DOM"
	></div>

	<div data-fin-watch="callbacks.changeFocus"></div>

	<div
		data-testid="short-circuit infinite loops"
		data-fin-watch="callbacks.infiniteLoop"
		data-fin-text="state.counter"
	>
		0
	</div>

	<button data-testid="toggle" data-fin-on--click="actions.toggle">
		Update
	</button>

	<button data-testid="increment" data-fin-on--click="actions.increment">
		Increment
	</button>
</div>
