<?php
/**
 * HTML for testing the directive `data-fin-on`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fin-interactive="directive-on-window">
	<button
		data-fin-on--click="actions.visibilityHandler"
		data-testid="visibility">
		Switch visibility
	</button>
	<div data-fin-text="state.isEventAttached" data-testid="isEventAttached">no</div>
	<div data-fin-show-mock="state.isVisible">
		<div
			data-fin-on-window--resize="callbacks.resizeHandler"
			data-fin-init="callbacks.init"
		>
			<p data-fin-text="state.counter" data-testid="counter">0</p>
		</div>
	</div>
	<div data-fin-on-window--resize="actions.resizeHandler" data-fin-on-window--resize--second="actions.resizeSecondHandler">
		<p data-fin-text="state.resizeHandler" data-testid="resizeHandler">no</p>
		<p data-fin-text="state.resizeSecondHandler" data-testid="resizeSecondHandler">no</p>
	</div>
</div>
