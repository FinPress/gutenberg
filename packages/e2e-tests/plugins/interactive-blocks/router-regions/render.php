<?php
/**
 * HTML for testing the hydration of router regions.
 *
 * @package gutenberg-test-interactive-blocks
 *
 * @phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UndefinedVariable
 */
?>

<section>
	<h2>Region 1</h2>
	<div
		data-fp-interactive="router-regions"
		data-fp-router-region="region-1"
	>
		<p
			data-testid="region-1-text"
			data-fp-text="state.region1.text"
		>not hydrated</p>
		<p
			data-testid="region-1-ssr"
		>content from page <?php echo $attributes['page']; ?></p>

		<button
			data-testid="state-counter"
			data-fp-text="state.counter.value"
			data-fp-on--click="actions.counter.increment"
		>NaN</button>

		<?php if ( isset( $attributes['next'] ) ) : ?>
			<a
				data-testid="next"
				data-fp-on--click="actions.router.navigate"
				href="<?php echo $attributes['next']; ?>"
			>Next</a>
		<?php else : ?>
			<a
				data-testid="back"
				data-fp-on--click="actions.router.back"
				href="#"
			>Back</a>
		<?php endif; ?>
	</div>
</section>

<div>
	<p
		data-testid="no-region-text-1"
		data-fp-text="state.region1.text"
	>not hydrated</p>
</div>

<section>
	<h2>Region 2</h2>
	<div
		data-fp-interactive="router-regions"
		data-fp-router-region="region-2"
	>
		<p
			data-testid="region-2-text"
			data-fp-text="state.region2.text"
		>not hydrated</p>
		<p
			data-testid="region-2-ssr"
		>content from page <?php echo $attributes['page']; ?></p>

		<button
			data-testid="context-counter"
			data-fp-context='{ "counter": { "initialValue": 0 } }'
			data-fp-init="actions.counter.init"
			data-fp-text="context.counter.value"
			data-fp-on--click="actions.counter.increment"
		>NaN</button>

		<div>
			<div>
				<p
					data-testid="no-region-text-2"
					data-fp-text="state.region2.text"
				>not hydrated</p>
			</div>

			<section>
				<h2>Nested region</h2>
				<div
					data-fp-interactive="router-regions"
					data-fp-router-region="nested-region"
				>
					<p data-testid="nested-region-ssr">
						content from page <?php echo $attributes['page']; ?>
					</p>

					<button data-testid="add-item" data-fp-on--click="actions.addItem">
						Add item
					</button>

					<ul>
						<template data-fp-each="state.items">
							<li data-testid="nested-item" data-fp-key="context.item" data-fp-text="context.item"></li>	
						</template>
						<li data-testid="nested-item" data-fp-each-child>item 1</li>
						<li data-testid="nested-item" data-fp-each-child>item 2</li>
						<li data-testid="nested-item" data-fp-each-child>item 3</li>
					</ul>
				</div>
			</section>
		</div>
	</div>
</section>

<div data-fp-interactive="router-regions">
	<div data-fp-router-region="invalid-region-1">
		<p data-testid="invalid-region-text-1">
			content from page <?php echo $attributes['page']; ?>
		</p>
	</div>
	<div data-fp-interactive="router-regions" data-fp-router-region="invalid-region-2">
		<p data-testid="invalid-region-text-2">
			content from page <?php echo $attributes['page']; ?>
		</p>
	</div>
</div>

<div id="regions-with-attach-to" data-testid="regions-with-attach-to">
	<?php
	/*
	 * Set of router regions with the `attachTo` property specified,
	 * as defined in the `regionsWithAttachTo` attribute.
	 *
	 * Each object inside such an attribute have the following properties:
	 * - `type`: the type of the HTML element where the `data-fp-router-region` directive is defined, e.g. 'div'.
	 * - `data`: the data passed to the `data-fp-router-region` directive, i.e., `id` and `attachTo`.
	 * - `hasDirectives`: a boolean indicating that the top element of the router region have actual directives that
	 *     make the element to be wrapped in a `Directives` component.
	 */
	foreach ( $attributes['regionsWithAttachTo'] ?? array() as $region ) {
		$region_type    = esc_attr( $region['type'] );
		$region_id      = esc_attr( $region['data']['id'] );
		$region_data    = fp_json_encode( $region['data'] );
		$has_directives = isset( $region['hasDirectives'] )
			? ' data-fp-init="callbacks.init"'
			: '';
		$context_data   = fp_interactivity_data_fp_context(
			array(
				'text'    => $region['data']['id'],
				'counter' => array(
					'value'       => $attributes['counter'] ?? 0,
					'serverValue' => $attributes['counter'] ?? 0,
				),
			)
		);

		$html = <<<HTML
		<$region_type
			data-fp-interactive="router-regions"
			data-fp-router-region='$region_data'
			data-testid="$region_id"
			$has_directives
		>
			<div $context_data>
				<h2>Region with <code>attachTo</code></h2>
				<p
					data-testid="text"
					data-fp-text="context.text"
				>not hydrated</p>

				<p> Client value:
					<button
						data-testid="client-counter"
						data-fp-text="context.counter.value"
						data-fp-on--click="actions.counter.increment"
					>
						NaN
					</button>
				</p>
				<p> Server value:
					<output
						data-testid="server-counter"
						data-fp-text="context.counter.serverValue"
						data-fp-watch="actions.counter.updateCounterFromServer"
					>
						NaN
					</output>
				</p>
			</div>
		</$region_type>
HTML;

		echo $html;
	}
	?>
</div>

<!--
	Count of times the `actions.init` function has been executed.
	Used to verify that `data-fp-init` works on regions with `attachTo`.
-->
<div
	data-fp-interactive="router-regions"
	data-testid="init-count"
	data-fp-text="state.initCount"
>
	NaN
</div>