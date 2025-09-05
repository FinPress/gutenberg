<?php
/**
 * HTML for testing the directive `data-fp-on`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fp-interactive="with-scope" data-fp-context='{"asyncCounter": 0, "syncCounter": 0}' data-fp-init--a='callbacks.asyncInit' data-fp-init--b='callbacks.syncInit'>
		<p data-fp-text="context.asyncCounter" data-testid="asyncCounter">0</p>
		<p data-fp-text="context.syncCounter" data-testid="syncCounter">0</p>
</div>
