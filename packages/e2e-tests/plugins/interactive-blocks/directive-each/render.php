<?php
/**
 * HTML for testing the directive `data-fp-each`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fp-interactive="directive-each">
	<div data-testid="letters">
		<template data-fp-each="state.letters">
			<p data-fp-text="context.item" data-testid="item"></p>
		</template>
		<!-- SSRed elements; they should be removed on hydration -->
		<p data-testid="item" data-fp-each-child>A</p>
		<p data-testid="item" data-fp-each-child>B</p>
		<p data-testid="item" data-fp-each-child>C</p>
	</div>

	<hr>

	<div data-testid="letters-kebab-case">
		<template data-fp-each--my-item="state.letters">
			<p data-fp-text="context.myItem" data-testid="item"></p>
		</template>
		<!-- SSRed elements; they should be removed on hydration -->
		<p data-testid="item" data-fp-each-child>A</p>
		<p data-testid="item" data-fp-each-child>B</p>
		<p data-testid="item" data-fp-each-child>C</p>
	</div>

	<hr>

	<div data-testid="fruits">
		<button
			data-testid="rotate" data-fp-on--click="actions.rotateFruits"
		>Rotate</button>
		<button
			data-testid="add" data-fp-on--click="actions.addFruit"
		>Add</button>
		<button
			data-testid="replace" data-fp-on--click="actions.replaceFruit"
		>Replace</button>
		<template data-fp-each--fruit="state.fruits">
			<p
				data-testid="item"
				data-fp-text="context.fruit"
				data-fp-on--click="actions.removeFruit"
			></p>
		</template>
		<!-- SSRed elements; they should be removed on hydration -->
		<p data-testid="item" data-fp-each-child>avocado</p>
		<p data-testid="item" data-fp-each-child>banana</p>
		<p data-testid="item" data-fp-each-child>cherimoya</p>
	</div>

	<hr>

	<div data-testid="books">
		<button
			data-testid="rotate" data-fp-on--click="actions.rotateBooks"
		>Rotate</button>
		<button
			data-testid="add" data-fp-on--click="actions.addBook"
		>Add</button>
		<button
			data-testid="replace" data-fp-on--click="actions.replaceBook"
		>Replace</button>
		<button
			data-testid="modify" data-fp-on--click="actions.modifyBook"
		>Modify</button>
		<template
			data-fp-each--book="state.books"
			data-fp-each-key="context.book.isbn"
		>
			<p
				data-testid="item"
				data-fp-text="context.book.title"
				data-fp-on--click="actions.removeBook"
			></p>
		</template>
		<!-- SSRed elements; they should be removed on hydration -->
		<p data-testid="item" data-fp-each-child>A Game of Thrones</p>
		<p data-testid="item" data-fp-each-child>A Clash of Kings</p>
		<p data-testid="item" data-fp-each-child>A Storm of Swords</p>
	</div>

	<hr>

	<div data-testid="numbers">
		<button
			data-testid="shift" data-fp-on--click="actions.shiftNumber"
		>Shift</button>
		<button
			data-testid="unshift" data-fp-on--click="actions.unshiftNumber"
		>Unshift</button>
		<template data-fp-each="state.numbers">
			<p data-fp-text="context.item" data-testid="item"></p>
		</template>
		<p data-testid="item" data-fp-each-child>1</p>
		<p data-testid="item" data-fp-each-child>2</p>
		<p data-testid="item" data-fp-each-child>3</p>
		<p data-testid="item">4</p>
	</div>

	<hr>

	<div data-testid="empty">
		<button
			data-testid="add" data-fp-on--click="actions.addItem"
		>Add</button>
		<template data-fp-each="state.emptyList">
			<p data-fp-text="context.item" data-testid="item"></p>
		</template>
		<p data-testid="item">item X</p>
	</div>

	<div data-testid="siblings">
		<button
			data-testid="unshift"
			data-fp-on--click="actions.unshiftNumberAndName"
		>Unshift</button>
		<template
			data-fp-each="state.numbersAndNames"
			data-fp-each-key="context.item.value"
		>
			<p data-fp-text="context.item.name" data-testid="item"></p>
			<p data-fp-text="context.item.value" data-testid="item"></p>
		</template>
		<p data-testid="item" data-fp-each-child>two</p>
		<p data-testid="item" data-fp-each-child>2</p>
		<p data-testid="item" data-fp-each-child>three</p>
		<p data-testid="item" data-fp-each-child>3</p>
		<p data-testid="item">four</p>
		<p data-testid="item">4</p>
	</div>

	<div data-testid="nested">
		<button
			data-testid="add animal"
			data-fp-on--click="actions.addAnimal"
		>Add animal</button>
		<button
			data-testid="add breeds"
			data-fp-on--click="actions.addBreeds"
		>Add breeds</button>

		<ul>
			<template
				data-fp-each--animal="state.animalBreeds"
				data-fp-each-key="context.animal.name"
			>
				<li data-testid="animal">
					<span
						data-testid="name"
						data-fp-text="context.animal.name"
					></span>
					<ul>
						<template data-fp-each--breed="context.animal.breeds">
							<li data-fp-text="context.breed"></li>
						</template>
					</ul>
				</li>
			</template>
			<!-- SSRed elements; they should be removed on hydration -->
			<li data-testid="animal" data-fp-each-child>
				<span data-testid="name">Dog</span>
				<ul>
					<template data-fp-each--breed="context.animal.breeds">
						<li data-fp-text="context.breed"></li>
					</template>
					<li data-fp-each-child>Chihuahua</li>
					<li data-fp-each-child>Rottweiler</li>
				</ul>
			</li>
			<li data-testid="animal" data-fp-each-child>
				<span data-testid="name">Cat</span>
				<ul>
					<template data-fp-each--breed="context.animal.breeds">
						<li data-fp-text="context.breed"></li>
					</template>
					<li data-fp-each-child>Sphynx</li>
					<li data-fp-each-child>Siamese</li>
				</ul>
			</li>
		</ul>
	</div>

	<div data-testid="invalid tag">
		<div data-fp-each="state.letters">
			<p data-fp-text="context.item" data-testid="item"></p>
		</div>
	</div>


	<div data-testid="derived state">
		<button
			data-testid="rotate" data-fp-on--click="actions.rotateFruits"
		>Rotate</button>
		<template
			data-fp-context='{ "idPrefix": "fruit-" }'
			data-fp-each--fruit="state.fruits"
			data-fp-each-key="state.fruitId"
		>
			<p
				data-testid="item"
				data-fp-text="context.fruit"
				data-fp-bind--data-fruit-id="state.fruitId"
			></p>
		</template>
		<!-- SSRed elements; they should be removed on hydration -->
		<p data-testid="item" data-fp-each-child>avocado</p>
		<p data-testid="item" data-fp-each-child>banana</p>
		<p data-testid="item" data-fp-each-child>cherimoya</p>
	</div>
</div>

<hr>

<div
	data-fp-interactive="directive-each"
	data-fp-router-region="navigation-updated list"
	data-fp-context='{ "b": 2, "c": 3, "d": 4 }'
	data-testid="navigation-updated list"
>
	<button
		data-testid="navigate"
		data-fp-on--click="actions.navigate"
	>Navigate</button>
	<template data-fp-each="state.list">
		<p data-fp-text="context.item" data-testid="item"></p>
	</template>
	<p data-testid="item" data-fp-each-child>beta</p>
	<p data-testid="item" data-fp-each-child>gamma</p>
	<p data-testid="item" data-fp-each-child>delta</p>
</div>

<hr>

<div
	data-fp-interactive="directive-each"
	data-fp-context='{ "list": [ "beta" ], "callbackRunCount": 0 }'
	data-testid="elements with directives"
>
	<template data-fp-each="context.list">
		<div
			data-testid="item"
			data-fp-text="context.item"
			data-fp-priority-2-init="callbacks.updateCallbackRunCount"
		></div>
	</template>
	<div
		data-fp-each-child
		data-testid="item"
		data-fp-text="context.item"
		data-fp-priority-2-init="callbacks.updateCallbackRunCount"
	></div>
	<data
		data-testid="callbackRunCount"
		data-fp-text="context.callbackRunCount"
	></data>
</div>

<hr>

<div
	data-fp-interactive="directive-each"
	data-testid="each-with-unset"
>
	<template data-fp-each="state.eachUnset"><p data-fp-text="context.item"></p></template>
</div>
<div
	data-fp-interactive="directive-each"
	data-testid="each-with-null"
>
	<template data-fp-each="state.eachNull"><p data-fp-text="context.item"></p></template>
</div>
<div
	data-fp-interactive="directive-each"
	data-testid="each-with-undefined"
>
	<template data-fp-each="state.eachUndefined"><p data-fp-text="context.item"></p></template>
</div>
<div
	data-fp-interactive="directive-each"
	data-testid="each-with-array"
>
	<template data-fp-each="state.eachArray"><p data-fp-text="context.item"></p></template>
</div>
<div
	data-fp-interactive="directive-each"
	data-testid="each-with-set"
>
	<template data-fp-each="state.eachSet"><p data-fp-text="context.item"></p></template>
</div>
<div
	data-fp-interactive="directive-each"
	data-testid="each-with-string"
>
	<template data-fp-each="state.eachString"><p data-fp-text="context.item"></p></template>
</div>
<div
	data-fp-interactive="directive-each"
	data-testid="each-with-generator"
>
	<template data-fp-each="state.eachGenerator"><p data-fp-text="context.item"></p></template>
</div>
<div
	data-fp-interactive="directive-each"
	data-testid="each-with-iterator"
>
	<template data-fp-each="state.eachIterator"><p data-fp-text="context.item"></p></template>
</div>
