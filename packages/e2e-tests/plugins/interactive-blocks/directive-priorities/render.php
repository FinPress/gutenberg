<?php
/**
 * HTML for testing priorities between directives.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fin-interactive="directive-priorities">
	<pre data-testid="execution order"></pre>

	<!-- Element with test directives -->
	<div
		data-testid="test directives"
		data-fin-test-attribute
		data-fin-test-children
		data-fin-test-text
		data-fin-test-context
	></div>
</div>

<div data-testid="non-existent-directives">
	<!-- WARNING: the `div` with `data-fin-non-existent-directive` should remain
		inline (i.e., without new line or blank characters in between) to
		ensure it is the only child node. Otherwise, tests could fail. -->
	<div data-fin-interactive="directive-priorities"><div data-fin-non-existent-directive></div></div>
</div>
