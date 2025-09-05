<?php
/**
 * HTML for testing the directive `data-fp-init`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fp-interactive="directive-init">
	<div
		data-testid="single init"
		data-fp-context='{"isReady":[false],"calls":[0]}'
		data-fp-init="actions.initOne"
	>
		<p data-fp-text="state.isReady" data-testid="isReady">false</p>
		<p data-fp-text="state.calls" data-testid="calls">0</p>
		<button data-fp-on--click="actions.reset">reset</button>
	</div>
	<div
		data-testid="multiple inits"
		data-fp-context='{"isReady":[false,false],"calls":[0,0]}'
		data-fp-init--one="actions.initOne"
		data-fp-init--two="actions.initTwo"
	>
		<p data-fp-text="state.isReady" data-testid="isReady">false,false</p>
		<p data-fp-text="state.calls" data-testid="calls">0,0</p>
	</div>
	<div
		data-testid="init show"
		data-fp-context='{"isVisible":true,"isMounted":false}'
	>
		<div data-fp-show-mock="context.isVisible" data-testid="show">
			<span data-fp-init="actions.initMount">Initially visible</span>
		</div>
		<button data-fp-on--click="actions.toggle" data-testid="toggle">
			toggle
		</button>
		<p data-fp-text="state.isMounted" data-testid="isMounted">
			true
		</p>
	</div>
</div>
