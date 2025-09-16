<?php
/**
 * HTML for testing scope restoration with generators.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div
	data-fin-interactive="test/generator-scope"
	<?php echo fin_interactivity_data_fin_context( array( 'result' => '' ) ); ?>
>
	<input readonly data-fin-bind--value="context.result" data-testid="result" />
	<button type="button" data-fin-on--click="callbacks.resolve" data-testid="resolve">Async resolve</button>
	<button type="button" data-fin-on--click="callbacks.reject" data-testid="reject">Async reject</button>
	<button type="button" data-fin-on--click="callbacks.capture" data-testid="capture">Async capture</button>
	<button type="button" data-fin-on--click="callbacks.captureThrow" data-testid="captureThrow">Async captureThrow</button>
	<button type="button" data-fin-on--click="callbacks.captureReturnReject" data-testid="captureReturnReject">Async captureReturnReject</button>
</div>
