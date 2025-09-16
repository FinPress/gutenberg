<?php
/**
 * HTML for testing the directive `data-fin-text`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fin-interactive="directive-context">
	<div>
		<span
			data-fin-text="state.text"
			data-testid="show state text"
		></span>
		<button
			data-fin-on--click="actions.toggleStateText"
			data-testid="toggle state text"
		>
			Toggle State Text
		</button>
	</div>

	<div data-fin-context='{ "text": "Text 1" }'>
		<span
			data-fin-text="context.text"
			data-testid="show context text"
		></span>
		<button
			data-fin-on--click="actions.toggleContextText"
			data-testid="toggle context text"
		>
			Toggle Context Text
		</button>
	</div>
	<div>
		<span
			data-fin-text="state.component"
			data-testid="show state component"
		></span>
		<span
			data-fin-text="state.number"
			data-testid="show state number"
		></span>
		<span
			data-fin-text="state.boolean"
			data-testid="show state boolean"
		></span>
	</div>
</div>
