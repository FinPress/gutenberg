<?php
/**
 * HTML for testing scope restoration with generators.
 *
 * @package gutenberg-test-interactive-blocks
 */

fin_interactivity_state(
	'test/deferred-store',
	array(
		'number' => 2,
		'double' => 4,
	)
);

?>

<div
	data-fin-interactive="test/deferred-store"
	<?php echo fin_interactivity_data_fin_context( array( 'text' => '!dlrow ,olleH' ) ); ?>
>
	<span data-fin-text="state.reversedText" data-testid="result"></span>
	<span data-fin-text="state.reversedTextGetter" data-testid="result-getter"></span>

	<span data-fin-text="state.number" data-testid="state-number"></span>
	<span data-fin-text="state.double" data-testid="state-double"></span>
</div>
