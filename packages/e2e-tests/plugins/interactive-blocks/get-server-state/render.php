<?php
/**
 * HTML for testing the getServerState() function.
 *
 * @package gutenberg-test-interactive-blocks
 *
 * @phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UndefinedVariable
 */

if ( isset( $attributes['state'] ) ) {
	fp_interactivity_state( 'test/get-server-state', $attributes['state'] );
}
?>

<div
	data-fp-interactive="test/get-server-state"
	data-fp-watch="callbacks.updateState"
>
	<div data-testid="prop" data-fp-text="state.prop"></div>
	<div data-testid="nested.prop" data-fp-text="state.nested.prop"></div>
	<div data-testid="newProp" data-fp-text="state.newProp"></div>
	<div data-testid="nested.newProp" data-fp-text="state.nested.newProp"></div>

	<button
		data-testid="tryToModifyServerState"
		<?php echo fp_interactivity_data_fp_context( array( 'result' => 'modify' ) ); ?>
		data-fp-on--click="actions.attemptModification"
		data-fp-text="context.result">
	>
		modify
	</button>


	<nav>
		<?php
		if ( isset( $attributes['links'] ) ) {
			foreach ( $attributes['links'] as $key => $link ) {
				$i = $key += 1;
				echo <<<HTML
				<a
					data-testid="link $i"
					data-fp-on--click="actions.navigate"
					href="$link"
				>link $i</a>
HTML;
			}
		}
		?>
	</nav>
</div>
