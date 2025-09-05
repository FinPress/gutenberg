<?php
/**
 * HTML for testing the directive `data-fp-watch`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fp-interactive="directive-watch">
	<div data-fp-show-mock="state.isOpen">
		<input
			data-testid="input"
			data-fp-watch="callbacks.elementAddedToTheDOM"
		/>
	</div>

	<div
		data-fp-text="state.elementInTheDOM"
		data-testid="element in the DOM"
	></div>

	<div data-fp-watch="callbacks.changeFocus"></div>

	<div
		data-testid="short-circuit infinite loops"
		data-fp-watch="callbacks.infiniteLoop"
		data-fp-text="state.counter"
	>
		0
	</div>

	<button data-testid="toggle" data-fp-on--click="actions.toggle">
		Update
	</button>

	<button data-testid="increment" data-fp-on--click="actions.increment">
		Increment
	</button>
</div>
