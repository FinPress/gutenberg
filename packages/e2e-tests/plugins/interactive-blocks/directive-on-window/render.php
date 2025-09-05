<?php
/**
 * HTML for testing the directive `data-fp-on`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fp-interactive="directive-on-window">
	<button
		data-fp-on--click="actions.visibilityHandler"
		data-testid="visibility">
		Switch visibility
	</button>
	<div data-fp-text="state.isEventAttached" data-testid="isEventAttached">no</div>
	<div data-fp-show-mock="state.isVisible">
		<div
			data-fp-on-window--resize="callbacks.resizeHandler"
			data-fp-init="callbacks.init"
		>
			<p data-fp-text="state.counter" data-testid="counter">0</p>
		</div>
	</div>
	<div data-fp-on-window--resize="actions.resizeHandler" data-fp-on-window--resize--second="actions.resizeSecondHandler">
		<p data-fp-text="state.resizeHandler" data-testid="resizeHandler">no</p>
		<p data-fp-text="state.resizeSecondHandler" data-testid="resizeSecondHandler">no</p>
	</div>
</div>
