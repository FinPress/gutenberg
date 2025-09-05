<?php
/**
 * HTML for testing the directive `data-fp-run`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div
	data-fp-interactive="directive-run"
	data-fp-router-region='test-directive-run'
>
	<div data-testid="hydrated" data-fp-text="state.isHydrated"></div>
	<div data-testid="mounted" data-fp-text="state.isMounted"></div>
	<div data-testid="renderCount" data-fp-text="state.renderCount"></div>
	<div data-testid="navigated">no</div>

	<div
		data-fp-run--hydrated="callbacks.updateIsHydrated"
		data-fp-run--renderCount="callbacks.updateRenderCount"
		data-fp-text="state.clickCount"
	></div>
</div>

<div data-fp-interactive="directive-run" >
	<button data-testid="toggle" data-fp-on--click="actions.toggle">
		Toggle
	</button>

	<button data-testid="increment" data-fp-on--click="actions.increment">
		Increment
	</button>

	<button data-testid="navigate" data-fp-on--click="actions.navigate">
		Navigate
	</button>

	<!-- Hook execution results are stored in this element as attributes. -->
	<div
		data-testid="fp-run hooks results"
		data-fp-show-children="state.isOpen"
		data-init=""
		data-watch=""
	>
		<div
			data-fp-run--mounted="callbacks.updateIsMounted"
			data-fp-run--hooks="callbacks.useHooks"
		>
			Element with fp-run using hooks
		</div>
	</div>
</div>
