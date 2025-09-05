<?php
/**
 * HTML for testing scope restoration with generators.
 *
 * @package gutenberg-test-interactive-blocks
 */

fp_interactivity_state(
	'test/deferred-store',
	array(
		'number' => 2,
		'double' => 4,
	)
);

?>

<div
	data-fp-interactive="test/deferred-store"
	<?php echo fp_interactivity_data_fp_context( array( 'text' => '!dlrow ,olleH' ) ); ?>
>
	<span data-fp-text="state.reversedText" data-testid="result"></span>
	<span data-fp-text="state.reversedTextGetter" data-testid="result-getter"></span>

	<span data-fp-text="state.number" data-testid="state-number"></span>
	<span data-fp-text="state.double" data-testid="state-double"></span>
</div>
