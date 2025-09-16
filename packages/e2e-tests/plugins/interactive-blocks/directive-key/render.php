<?php
/**
 * HTML for testing the directive `data-fin-key`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div
	data-fin-interactive="directive-key"
	data-fin-router-region="some-id"
>
	<ul>
		<li data-fin-key="id-2" data-testid="first-item">2</li>
		<li data-fin-key="id-3">3</li>
	</ul>
	<button data-testid="navigate" data-fin-on--click="actions.navigate">
		Navigate
	</button>
</div>
