<?php
/**
 * HTML for testing the directive `data-fin-run`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div
	data-fin-interactive="directive-run"
	data-fin-router-region='test-directive-run'
>
	<div data-testid="hydrated" data-fin-text="state.isHydrated"></div>
	<div data-testid="mounted" data-fin-text="state.isMounted"></div>
	<div data-testid="renderCount" data-fin-text="state.renderCount"></div>
	<div data-testid="navigated">no</div>

	<div
		data-fin-run--hydrated="callbacks.updateIsHydrated"
		data-fin-run--renderCount="callbacks.updateRenderCount"
		data-fin-text="state.clickCount"
	></div>
</div>

<div data-fin-interactive="directive-run" >
	<button data-testid="toggle" data-fin-on--click="actions.toggle">
		Toggle
	</button>

	<button data-testid="increment" data-fin-on--click="actions.increment">
		Increment
	</button>

	<button data-testid="navigate" data-fin-on--click="actions.navigate">
		Navigate
	</button>

	<!-- Hook execution results are stored in this element as attributes. -->
	<div
		data-testid="fin-run hooks results"
		data-fin-show-children="state.isOpen"
		data-init=""
		data-watch=""
	>
		<div
			data-fin-run--mounted="callbacks.updateIsMounted"
			data-fin-run--hooks="callbacks.useHooks"
		>
			Element with fin-run using hooks
		</div>
	</div>
</div>
