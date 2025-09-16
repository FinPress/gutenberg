<?php
/**
 * HTML for testing the directive `data-fin-on`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<?php // A wrong directive name like "data-fin-on--" should not kill the interactivity. ?>
<div data-fin-interactive="directive-on" data-fin-on--="">
	<div>
		<p data-fin-text="state.counter" data-testid="counter">0</p>
		<button
			data-testid="button"
			data-fin-on--click="actions.clickHandler"
		>Click me!</button>
	</div>
	<div>
		<p data-fin-text="state.text" data-testid="text">initial</p>
		<input
			type="text"
			value="initial"
			data-testid="input"
			data-fin-on--input="actions.inputHandler"
		>
	</div>
	<div data-fin-context='{"option":"undefined"}'>
		<p data-fin-text="context.option" data-testid="option">0</p>
		<select
			name="pets"
			value="undefined"
			data-testid="select"
			data-fin-on--change="actions.selectHandler"
		>
			<option value="undefined">Choose an option...</option>
			<option value="dog">Dog</option>
			<option value="cat">Cat</option>
		</select>
	</div>
	<div
		data-fin-on--customevent="actions.customEventHandler"
		data-fin-context='{"customEvents":0}'
	>
		<p
			data-fin-text="context.customEvents"
			data-testid="custom events counter"
		>0</p>
		<button
			data-testid="custom events button"
			data-fin-on--click="actions.clickHandler"
		>Click me!</button>
	</div>
	<div data-fin-context='{"clicked":false,"clickCount":0,"isOpen":true}'>
		<p
			data-fin-text="context.clicked"
			data-testid="multiple handlers clicked"
		>false</p>
		<p
			data-fin-text="context.clickCount"
			data-testid="multiple handlers clickCount"
		>0</p>
		<p
			data-fin-text="context.isOpen"
			data-testid="multiple handlers isOpen"
		>true</p>
		<button
			data-testid="multiple handlers button"
			data-fin-on--click="actions.setClicked"
			data-fin-on--click--counter="actions.countClick"
			data-fin-on--click--toggle="actions.toggle"
		>Click me!</button>
	</div>
</div>
