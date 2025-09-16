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
	data-fin-interactive="test/get-server-context"
	data-fin-on--click="actions.navigate"
>
	<a data-testid="modified" href="<?php echo esc_url( $link1 ); ?>">modified</a>
	<a data-testid="newProps" href="<?php echo esc_url( $link2 ); ?>">newProps</a>
</nav>

<div
	data-fin-interactive="test/get-server-context"
	data-fin-router-region="server-context"
	data-fin-watch="callbacks.updateServerContextParent"
	<?php echo fin_interactivity_data_fin_context( $parent_ctx ); ?>
>
	<div
		data-fin-watch="callbacks.updateServerContextChild"
		<?php echo fin_interactivity_data_fin_context( $child_ctx ); ?>
	>
		<div data-testid="prop" data-fin-text="context.prop"></div>
		<div data-testid="nested.prop" data-fin-text="context.nested.prop"></div>
		<div data-testid="newProp" data-fin-text="context.newProp"></div>
		<div data-testid="nested.newProp" data-fin-text="context.nested.newProp"></div>
		<div data-testid="inherited.prop" data-fin-text="context.inherited.prop"></div>
		<div data-testid="inherited.newProp" data-fin-text="context.inherited.newProp"></div>

		<button
			data-testid="tryToModifyServerContext"
			<?php echo fin_interactivity_data_fin_context( array( 'result' => 'modify' ) ); ?>
			data-fin-on--click="actions.attemptModification"
			data-fin-text="context.result">
		>
			modify
		</button>
	</div>
</div>
