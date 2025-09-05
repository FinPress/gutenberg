<?php
/**
 * HTML for testing the directive `data-fp-key`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div
	data-fp-interactive="directive-key"
	data-fp-router-region="some-id"
>
	<ul>
		<li data-fp-key="id-2" data-testid="first-item">2</li>
		<li data-fp-key="id-3">3</li>
	</ul>
	<button data-testid="navigate" data-fp-on--click="actions.navigate">
		Navigate
	</button>
</div>
