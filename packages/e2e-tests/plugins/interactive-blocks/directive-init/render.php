<?php
/**
 * HTML for testing the directive `data-fin-init`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fin-interactive="directive-init">
	<div
		data-testid="single init"
		data-fin-context='{"isReady":[false],"calls":[0]}'
		data-fin-init="actions.initOne"
	>
		<p data-fin-text="state.isReady" data-testid="isReady">false</p>
		<p data-fin-text="state.calls" data-testid="calls">0</p>
		<button data-fin-on--click="actions.reset">reset</button>
	</div>
	<div
		data-testid="multiple inits"
		data-fin-context='{"isReady":[false,false],"calls":[0,0]}'
		data-fin-init--one="actions.initOne"
		data-fin-init--two="actions.initTwo"
	>
		<p data-fin-text="state.isReady" data-testid="isReady">false,false</p>
		<p data-fin-text="state.calls" data-testid="calls">0,0</p>
	</div>
	<div
		data-testid="init show"
		data-fin-context='{"isVisible":true,"isMounted":false}'
	>
		<div data-fin-show-mock="context.isVisible" data-testid="show">
			<span data-fin-init="actions.initMount">Initially visible</span>
		</div>
		<button data-fin-on--click="actions.toggle" data-testid="toggle">
			toggle
		</button>
		<p data-fin-text="state.isMounted" data-testid="isMounted">
			true
		</p>
	</div>
</div>
