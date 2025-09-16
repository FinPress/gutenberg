<?php
/**
 * HTML for testing the directive `data-fin-on`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fin-interactive="directive-on-document">
	<button
		data-testid="visibility"
		data-fin-on--click="actions.visibilityHandler"
	>
		Switch visibility
	</button>

	<div data-fin-text="state.isEventAttached" data-testid="isEventAttached">no</div>

	<div data-fin-show-mock="state.isVisible">
		<div
			data-fin-on-document--keydown="callbacks.keydownHandler"
			data-fin-init="callbacks.init"
		>
			<p data-fin-text="state.counter" data-testid="counter">0</p>
		</div>
	</div>
	<div data-fin-on-document--keydown="actions.keydownHandler" data-fin-on-document--keydown--second="actions.keydownSecondHandler">
		<p data-fin-text="state.keydownHandler" data-testid="keydownHandler">no</p>
		<p data-fin-text="state.keydownSecondHandler" data-testid="keydownSecondHandler">no</p>
	</div>
</div>
