<?php
/**
 * HTML for testing the directive `data-fin-bind`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fin-interactive="">
	<a data-fin-bind--href="state.url" data-testid="empty namespace"></a>
</div>

<div data-fin-interactive="namespace">
	<a data-fin-bind--href="state.url" data-testid="correct namespace"></a>
</div>

<div data-fin-interactive="{}">
	<a data-fin-bind--href="state.url" data-testid="object namespace"></a>
</div>

<div data-fin-interactive="null">
	<a data-fin-bind--href="state.url" data-testid="null namespace"></a>
</div>

<div data-fin-interactive="2">
	<a data-fin-bind--href="state.url" data-testid="number namespace"></a>
</div>

<div data-fin-interactive>
	<a data-fin-bind--href="other::state.url" data-testid="other namespace"></a>
</div>

<div data-fin-interactive="true">
	<a data-fin-bind--href="state.url" data-testid="true namespace"></a>
</div>

<div data-fin-interactive="false">
	<a data-fin-bind--href="state.url" data-testid="false namespace"></a>
</div>
<div data-fin-interactive="[]">
	<a data-fin-bind--href="state.url" data-testid="[] namespace"></a>
</div>
<div data-fin-interactive='"quoted string"'>
	<a data-fin-bind--href="state.url" data-testid="quoted namespace"></a>
</div>
