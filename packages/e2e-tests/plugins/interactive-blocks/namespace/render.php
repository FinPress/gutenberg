<?php
/**
 * HTML for testing the directive `data-fp-bind`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fp-interactive="">
	<a data-fp-bind--href="state.url" data-testid="empty namespace"></a>
</div>

<div data-fp-interactive="namespace">
	<a data-fp-bind--href="state.url" data-testid="correct namespace"></a>
</div>

<div data-fp-interactive="{}">
	<a data-fp-bind--href="state.url" data-testid="object namespace"></a>
</div>

<div data-fp-interactive="null">
	<a data-fp-bind--href="state.url" data-testid="null namespace"></a>
</div>

<div data-fp-interactive="2">
	<a data-fp-bind--href="state.url" data-testid="number namespace"></a>
</div>

<div data-fp-interactive>
	<a data-fp-bind--href="other::state.url" data-testid="other namespace"></a>
</div>

<div data-fp-interactive="true">
	<a data-fp-bind--href="state.url" data-testid="true namespace"></a>
</div>

<div data-fp-interactive="false">
	<a data-fp-bind--href="state.url" data-testid="false namespace"></a>
</div>
<div data-fp-interactive="[]">
	<a data-fp-bind--href="state.url" data-testid="[] namespace"></a>
</div>
<div data-fp-interactive='"quoted string"'>
	<a data-fp-bind--href="state.url" data-testid="quoted namespace"></a>
</div>
