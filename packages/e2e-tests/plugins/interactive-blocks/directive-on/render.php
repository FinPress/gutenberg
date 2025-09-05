<?php
/**
 * HTML for testing the directive `data-fp-on`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<?php // A wrong directive name like "data-fp-on--" should not kill the interactivity. ?>
<div data-fp-interactive="directive-on" data-fp-on--="">
	<div>
		<p data-fp-text="state.counter" data-testid="counter">0</p>
		<button
			data-testid="button"
			data-fp-on--click="actions.clickHandler"
		>Click me!</button>
	</div>
	<div>
		<p data-fp-text="state.text" data-testid="text">initial</p>
		<input
			type="text"
			value="initial"
			data-testid="input"
			data-fp-on--input="actions.inputHandler"
		>
	</div>
	<div data-fp-context='{"option":"undefined"}'>
		<p data-fp-text="context.option" data-testid="option">0</p>
		<select
			name="pets"
			value="undefined"
			data-testid="select"
			data-fp-on--change="actions.selectHandler"
		>
			<option value="undefined">Choose an option...</option>
			<option value="dog">Dog</option>
			<option value="cat">Cat</option>
		</select>
	</div>
	<div
		data-fp-on--customevent="actions.customEventHandler"
		data-fp-context='{"customEvents":0}'
	>
		<p
			data-fp-text="context.customEvents"
			data-testid="custom events counter"
		>0</p>
		<button
			data-testid="custom events button"
			data-fp-on--click="actions.clickHandler"
		>Click me!</button>
	</div>
	<div data-fp-context='{"clicked":false,"clickCount":0,"isOpen":true}'>
		<p
			data-fp-text="context.clicked"
			data-testid="multiple handlers clicked"
		>false</p>
		<p
			data-fp-text="context.clickCount"
			data-testid="multiple handlers clickCount"
		>0</p>
		<p
			data-fp-text="context.isOpen"
			data-testid="multiple handlers isOpen"
		>true</p>
		<button
			data-testid="multiple handlers button"
			data-fp-on--click="actions.setClicked"
			data-fp-on--click--counter="actions.countClick"
			data-fp-on--click--toggle="actions.toggle"
		>Click me!</button>
	</div>
</div>
