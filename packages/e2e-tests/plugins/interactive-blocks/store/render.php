<?php
/**
 * HTML for testing the `store` function.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fin-interactive="test/store">
	<div data-fin-text="state.0" data-testid="state-0"></div>
	<div
		data-testid="non-plain object"
		data-fin-text="state.isNotProxified"
		data-fin-init="callbacks.init"
	></div>
</div>
