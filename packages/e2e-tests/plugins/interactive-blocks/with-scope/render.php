<?php
/**
 * HTML for testing the directive `data-fin-on`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fin-interactive="with-scope" data-fin-context='{"asyncCounter": 0, "syncCounter": 0}' data-fin-init--a='callbacks.asyncInit' data-fin-init--b='callbacks.syncInit'>
		<p data-fin-text="context.asyncCounter" data-testid="asyncCounter">0</p>
		<p data-fin-text="context.syncCounter" data-testid="syncCounter">0</p>
</div>
