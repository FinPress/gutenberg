<?php
/**
 * HTML for testing the directive `data-fin-bind`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fin-interactive="directive-bind">
	<a
		data-fin-bind--href="state.url"
		data-testid="add missing href at hydration"
	></a>

	<a
		href="/other-url"
		data-fin-bind--href="state.url"
		data-testid="change href at hydration"
	></a>

	<input
		type="checkbox"
		data-fin-bind--checked="state.checked"
		data-testid="add missing checked at hydration"
	/>

	<input
		type="checkbox"
		checked
		data-fin-bind--checked="!state.checked"
		data-testid="remove existing checked at hydration"
	/>

	<a
		href="/other-url"
		data-fin-bind--href="state.url"
		data-testid="nested binds - 1"
	>
		<img
			width="1"
			data-fin-bind--width="state.width"
			data-testid="nested binds - 2"
		/>
	</a>

	<button data-testid="toggle" data-fin-on--click="actions.toggle">
		Update
	</button>

	<p
		data-fin-bind--hidden="!state.show"
		data-fin-bind--aria-hidden="!state.show"
		data-fin-bind--aria-expanded="state.show"
		data-fin-bind--data-some-value="state.show"
		data-testid="check enumerated attributes with true/false exist and have a string value"
	>
		Some Text
	</p>

	<?php
	$hydration_cases = array(
		'false'       => '{ "value": false }',
		'true'        => '{ "value": true }',
		'null'        => '{ "value": null }',
		'undef'       => '{ "__any": "any" }',
		'emptyString' => '{ "value": "" }',
		'anyString'   => '{ "value": "any" }',
		'number'      => '{ "value": 10 }',
	);
	?>

	<?php foreach ( $hydration_cases as $type => $context ) : ?>
	<div
		data-testid='hydrating <?php echo $type; ?>'
		data-fin-context='<?php echo $context; ?>'
	>
		<img
			alt="Red dot"
			data-testid="image"
			data-fin-bind--width="context.value"
			src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA
			AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO
			9TXL0Y4OHwAAAABJRU5ErkJggg=="
		>
		<input
			type="text"
			data-testid="input"
			data-fin-bind--name="context.value"
			data-fin-bind--value="context.value"
			data-fin-bind--disabled="context.value"
			data-fin-bind--aria-disabled="context.value"
		>
		<button
			data-testid="toggle value"
			data-fin-on--click="actions.toggleValue"
			data-fin-bind--data-toggle-count="context.count"
		>Toggle</button>
	</div>
	<?php endforeach; ?>
</div>
