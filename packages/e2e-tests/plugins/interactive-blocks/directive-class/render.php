<?php
/**
 * HTML for testing the directive `data-fp-class`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fp-interactive='{"namespace": "directive-class"}'>
	<button
		data-fp-on--click="actions.toggleTrueValue"
		data-testid="toggle trueValue"
	>
		Toggle trueValue
	</button>

	<button
		data-fp-on--click="actions.toggleFalseValue"
		data-testid="toggle falseValue"
	>
		Toggle falseValue
	</button>

	<div
		class="foo bar"
		data-fp-class--foo="state.falseValue"
		data-testid="remove class if callback returns falsy value"
	></div>

	<div
		class="foo"
		data-fp-class--bar="state.trueValue"
		data-testid="add class if callback returns truthy value"
	></div>

	<div
		class="foo bar"
		data-fp-class--foo="state.falseValue"
		data-fp-class--bar="state.trueValue"
		data-fp-class--baz="state.trueValue"
		data-testid="handles multiple classes and callbacks"
	></div>

	<div
		class="foo foo-bar"
		data-fp-class--foo="state.falseValue"
		data-fp-class--foo-bar="state.trueValue"
		data-testid="handles class names that are contained inside other class names"
	></div>

	<div
		class="foo bar baz"
		data-fp-class--bar="state.trueValue"
		data-testid="can toggle class in the middle"
	></div>

	<div
		data-fp-class--foo="state.falseValue"
		data-testid="can toggle class when class attribute is missing"
	></div>

	<div data-fp-context='{ "value": false }'>
		<div
			class="foo"
			data-fp-class--foo="context.value"
			data-testid="can use context values"
		></div>
		<button
			data-fp-on--click="actions.toggleContextValue"
			data-testid="toggle context false value"
		>
			Toggle context value
		</button>
	</div>

	<div
		data-fp-class--block__element--modifier="state.trueValue"
		data-testid="can use BEM notation classes"
	></div>

	<div
		data-fp-class--main-bg----color="state.trueValue"
		data-testid="can use classes with several dashes"
	></div>

	<div data-fp-context='{ "value": false }'>
		<div
			data-fp-class--default="context.value"
			data-testid="class name default"
		></div>
		<button
			data-fp-on--click="actions.toggleContextValue"
			data-testid="toggle class name default"
		>
			Toggle context val
		</button>
	</div>
</div>
