<?php
/**
 * HTML for testing the `store` function.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fp-interactive="test/store">
	<div data-fp-text="state.0" data-testid="state-0"></div>
	<div
		data-testid="non-plain object"
		data-fp-text="state.isNotProxified"
		data-fp-init="callbacks.init"
	></div>
</div>
