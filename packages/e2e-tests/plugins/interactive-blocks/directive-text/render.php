<?php
/**
 * HTML for testing the directive `data-fp-text`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fp-interactive="directive-context">
	<div>
		<span
			data-fp-text="state.text"
			data-testid="show state text"
		></span>
		<button
			data-fp-on--click="actions.toggleStateText"
			data-testid="toggle state text"
		>
			Toggle State Text
		</button>
	</div>

	<div data-fp-context='{ "text": "Text 1" }'>
		<span
			data-fp-text="context.text"
			data-testid="show context text"
		></span>
		<button
			data-fp-on--click="actions.toggleContextText"
			data-testid="toggle context text"
		>
			Toggle Context Text
		</button>
	</div>
	<div>
		<span
			data-fp-text="state.component"
			data-testid="show state component"
		></span>
		<span
			data-fp-text="state.number"
			data-testid="show state number"
		></span>
		<span
			data-fp-text="state.boolean"
			data-testid="show state boolean"
		></span>
	</div>
</div>
