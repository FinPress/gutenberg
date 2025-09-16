<?php
/**
 * HTML for testing the getServerState() function.
 *
 * @package gutenberg-test-interactive-blocks
 *
 * @phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UndefinedVariable
 */

if ( isset( $attributes['state'] ) ) {
	fin_interactivity_state( 'test/get-server-state', $attributes['state'] );
}
?>

<div
	data-fin-interactive="test/get-server-state"
	data-fin-watch="callbacks.updateState"
>
	<div data-testid="prop" data-fin-text="state.prop"></div>
	<div data-testid="nested.prop" data-fin-text="state.nested.prop"></div>
	<div data-testid="newProp" data-fin-text="state.newProp"></div>
	<div data-testid="nested.newProp" data-fin-text="state.nested.newProp"></div>

	<button
		data-testid="tryToModifyServerState"
		<?php echo fin_interactivity_data_fin_context( array( 'result' => 'modify' ) ); ?>
		data-fin-on--click="actions.attemptModification"
		data-fin-text="context.result">
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
					data-fin-on--click="actions.navigate"
					href="$link"
				>link $i</a>
HTML;
			}
		}
		?>
	</nav>
</div>
