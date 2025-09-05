<?php
/**
 * HTML for testing the directive `data-fp-bind`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fp-interactive="directive-bind">
	<a
		data-fp-bind--href="state.url"
		data-testid="add missing href at hydration"
	></a>

	<a
		href="/other-url"
		data-fp-bind--href="state.url"
		data-testid="change href at hydration"
	></a>

	<input
		type="checkbox"
		data-fp-bind--checked="state.checked"
		data-testid="add missing checked at hydration"
	/>

	<input
		type="checkbox"
		checked
		data-fp-bind--checked="!state.checked"
		data-testid="remove existing checked at hydration"
	/>

	<a
		href="/other-url"
		data-fp-bind--href="state.url"
		data-testid="nested binds - 1"
	>
		<img
			width="1"
			data-fp-bind--width="state.width"
			data-testid="nested binds - 2"
		/>
	</a>

	<button data-testid="toggle" data-fp-on--click="actions.toggle">
		Update
	</button>

	<p
		data-fp-bind--hidden="!state.show"
		data-fp-bind--aria-hidden="!state.show"
		data-fp-bind--aria-expanded="state.show"
		data-fp-bind--data-some-value="state.show"
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
		data-fp-context='<?php echo $context; ?>'
	>
		<img
			alt="Red dot"
			data-testid="image"
			data-fp-bind--width="context.value"
			src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA
			AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO
			9TXL0Y4OHwAAAABJRU5ErkJggg=="
		>
		<input
			type="text"
			data-testid="input"
			data-fp-bind--name="context.value"
			data-fp-bind--value="context.value"
			data-fp-bind--disabled="context.value"
			data-fp-bind--aria-disabled="context.value"
		>
		<button
			data-testid="toggle value"
			data-fp-on--click="actions.toggleValue"
			data-fp-bind--data-toggle-count="context.count"
		>Toggle</button>
	</div>
	<?php endforeach; ?>
</div>
