<?php
/**
 * HTML for testing the getServerContext() function.
 *
 * @package gutenberg-test-interactive-blocks
 *
 * @phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UndefinedVariable
 */

$link1      = $attributes['links']['modified'];
$link2      = $attributes['links']['newProps'];
$parent_ctx = $attributes['parentContext'];
$child_ctx  = $attributes['childContext'];
?>

<nav
	data-testid="navigate"
	data-fp-interactive="test/get-server-context"
	data-fp-on--click="actions.navigate"
>
	<a data-testid="modified" href="<?php echo esc_url( $link1 ); ?>">modified</a>
	<a data-testid="newProps" href="<?php echo esc_url( $link2 ); ?>">newProps</a>
</nav>

<div
	data-fp-interactive="test/get-server-context"
	data-fp-router-region="server-context"
	data-fp-watch="callbacks.updateServerContextParent"
	<?php echo fp_interactivity_data_fp_context( $parent_ctx ); ?>
>
	<div
		data-fp-watch="callbacks.updateServerContextChild"
		<?php echo fp_interactivity_data_fp_context( $child_ctx ); ?>
	>
		<div data-testid="prop" data-fp-text="context.prop"></div>
		<div data-testid="nested.prop" data-fp-text="context.nested.prop"></div>
		<div data-testid="newProp" data-fp-text="context.newProp"></div>
		<div data-testid="nested.newProp" data-fp-text="context.nested.newProp"></div>
		<div data-testid="inherited.prop" data-fp-text="context.inherited.prop"></div>
		<div data-testid="inherited.newProp" data-fp-text="context.inherited.newProp"></div>

		<button
			data-testid="tryToModifyServerContext"
			<?php echo fp_interactivity_data_fp_context( array( 'result' => 'modify' ) ); ?>
			data-fp-on--click="actions.attemptModification"
			data-fp-text="context.result">
		>
			modify
		</button>
	</div>
</div>
