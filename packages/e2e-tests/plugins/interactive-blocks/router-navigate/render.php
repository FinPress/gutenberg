<?php
/**
 * HTML for testing the router navigate function.
 *
 * @package gutenberg-test-interactive-blocks
 *
 * @phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UndefinedVariable
 */

if ( $attributes['disableNavigation'] ) {
	fp_interactivity_config(
		'core/router',
		array( 'clientNavigationDisabled' => true )
	);
}

if ( isset( $attributes['data'] ) ) {
	fp_interactivity_state(
		'router',
		array( 'data' => $attributes['data'] )
	);
}
?>

<div
	data-fp-interactive="router"
	data-fp-router-region="region-1"
>
	<h2 data-testid="title"><?php echo $attributes['title']; ?></h2>

	<output
		data-testid="router navigations pending"
		data-fp-text="state.navigations.pending"
	>NaN</output>
	<output
		data-testid="router navigations count"
		data-fp-text="state.navigations.count"
	>NaN</output>
	<output
		data-testid="router status"
		data-fp-text="state.status"
	>undefined</output>

	<button
		data-fp-on--click="actions.toggleTimeout"
		data-testid="toggle timeout"
	>
		Timeout <span data-fp-text="state.timeout">NaN</span>
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
				<a
					data-testid="link $i with hash"
					data-fp-on--click="actions.navigate"
					data-force-navigation="true"
					href="$link#link-$i-with-hash"
				>link $i with hash</a>
HTML;
			}
		}
		?>
	</nav>
	<div data-testid="getterProp" data-fp-text="state.data.getterProp"></div>
	<div data-testid="prop1" data-fp-text="state.data.prop1"></div>
	<div data-testid="prop2" data-fp-text="state.data.prop2"></div>
	<div data-testid="prop3" data-fp-text="state.data.prop3"></div>
</div>
