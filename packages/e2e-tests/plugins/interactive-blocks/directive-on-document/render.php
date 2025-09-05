<?php
/**
 * HTML for testing the directive `data-fp-on`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fp-interactive="directive-on-document">
	<button
		data-testid="visibility"
		data-fp-on--click="actions.visibilityHandler"
	>
		Switch visibility
	</button>

	<div data-fp-text="state.isEventAttached" data-testid="isEventAttached">no</div>

	<div data-fp-show-mock="state.isVisible">
		<div
			data-fp-on-document--keydown="callbacks.keydownHandler"
			data-fp-init="callbacks.init"
		>
			<p data-fp-text="state.counter" data-testid="counter">0</p>
		</div>
	</div>
	<div data-fp-on-document--keydown="actions.keydownHandler" data-fp-on-document--keydown--second="actions.keydownSecondHandler">
		<p data-fp-text="state.keydownHandler" data-testid="keydownHandler">no</p>
		<p data-fp-text="state.keydownSecondHandler" data-testid="keydownSecondHandler">no</p>
	</div>
</div>
