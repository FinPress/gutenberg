<?php
/**
 * HTML for testing priorities between directives.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fp-interactive="directive-priorities">
	<pre data-testid="execution order"></pre>

	<!-- Element with test directives -->
	<div
		data-testid="test directives"
		data-fp-test-attribute
		data-fp-test-children
		data-fp-test-text
		data-fp-test-context
	></div>
</div>

<div data-testid="non-existent-directives">
	<!-- WARNING: the `div` with `data-fp-non-existent-directive` should remain
		inline (i.e., without new line or blank characters in between) to
		ensure it is the only child node. Otherwise, tests could fail. -->
	<div data-fp-interactive="directive-priorities"><div data-fp-non-existent-directive></div></div>
</div>
