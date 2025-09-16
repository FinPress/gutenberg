<?php
/**
 * HTML for testing the directive `data-fin-each`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fin-interactive="directive-each">
	<div data-testid="letters">
		<template data-fin-each="state.letters">
			<p data-fin-text="context.item" data-testid="item"></p>
		</template>
		<!-- SSRed elements; they should be removed on hydration -->
		<p data-testid="item" data-fin-each-child>A</p>
		<p data-testid="item" data-fin-each-child>B</p>
		<p data-testid="item" data-fin-each-child>C</p>
	</div>

	<hr>

	<div data-testid="letters-kebab-case">
		<template data-fin-each--my-item="state.letters">
			<p data-fin-text="context.myItem" data-testid="item"></p>
		</template>
		<!-- SSRed elements; they should be removed on hydration -->
		<p data-testid="item" data-fin-each-child>A</p>
		<p data-testid="item" data-fin-each-child>B</p>
		<p data-testid="item" data-fin-each-child>C</p>
	</div>

	<hr>

	<div data-testid="fruits">
		<button
			data-testid="rotate" data-fin-on--click="actions.rotateFruits"
		>Rotate</button>
		<button
			data-testid="add" data-fin-on--click="actions.addFruit"
		>Add</button>
		<button
			data-testid="replace" data-fin-on--click="actions.replaceFruit"
		>Replace</button>
		<template data-fin-each--fruit="state.fruits">
			<p
				data-testid="item"
				data-fin-text="context.fruit"
				data-fin-on--click="actions.removeFruit"
			></p>
		</template>
		<!-- SSRed elements; they should be removed on hydration -->
		<p data-testid="item" data-fin-each-child>avocado</p>
		<p data-testid="item" data-fin-each-child>banana</p>
		<p data-testid="item" data-fin-each-child>cherimoya</p>
	</div>

	<hr>

	<div data-testid="books">
		<button
			data-testid="rotate" data-fin-on--click="actions.rotateBooks"
		>Rotate</button>
		<button
			data-testid="add" data-fin-on--click="actions.addBook"
		>Add</button>
		<button
			data-testid="replace" data-fin-on--click="actions.replaceBook"
		>Replace</button>
		<button
			data-testid="modify" data-fin-on--click="actions.modifyBook"
		>Modify</button>
		<template
			data-fin-each--book="state.books"
			data-fin-each-key="context.book.isbn"
		>
			<p
				data-testid="item"
				data-fin-text="context.book.title"
				data-fin-on--click="actions.removeBook"
			></p>
		</template>
		<!-- SSRed elements; they should be removed on hydration -->
		<p data-testid="item" data-fin-each-child>A Game of Thrones</p>
		<p data-testid="item" data-fin-each-child>A Clash of Kings</p>
		<p data-testid="item" data-fin-each-child>A Storm of Swords</p>
	</div>

	<hr>

	<div data-testid="numbers">
		<button
			data-testid="shift" data-fin-on--click="actions.shiftNumber"
		>Shift</button>
		<button
			data-testid="unshift" data-fin-on--click="actions.unshiftNumber"
		>Unshift</button>
		<template data-fin-each="state.numbers">
			<p data-fin-text="context.item" data-testid="item"></p>
		</template>
		<p data-testid="item" data-fin-each-child>1</p>
		<p data-testid="item" data-fin-each-child>2</p>
		<p data-testid="item" data-fin-each-child>3</p>
		<p data-testid="item">4</p>
	</div>

	<hr>

	<div data-testid="empty">
		<button
			data-testid="add" data-fin-on--click="actions.addItem"
		>Add</button>
		<template data-fin-each="state.emptyList">
			<p data-fin-text="context.item" data-testid="item"></p>
		</template>
		<p data-testid="item">item X</p>
	</div>

	<div data-testid="siblings">
		<button
			data-testid="unshift"
			data-fin-on--click="actions.unshiftNumberAndName"
		>Unshift</button>
		<template
			data-fin-each="state.numbersAndNames"
			data-fin-each-key="context.item.value"
		>
			<p data-fin-text="context.item.name" data-testid="item"></p>
			<p data-fin-text="context.item.value" data-testid="item"></p>
		</template>
		<p data-testid="item" data-fin-each-child>two</p>
		<p data-testid="item" data-fin-each-child>2</p>
		<p data-testid="item" data-fin-each-child>three</p>
		<p data-testid="item" data-fin-each-child>3</p>
		<p data-testid="item">four</p>
		<p data-testid="item">4</p>
	</div>

	<div data-testid="nested">
		<button
			data-testid="add animal"
			data-fin-on--click="actions.addAnimal"
		>Add animal</button>
		<button
			data-testid="add breeds"
			data-fin-on--click="actions.addBreeds"
		>Add breeds</button>

		<ul>
			<template
				data-fin-each--animal="state.animalBreeds"
				data-fin-each-key="context.animal.name"
			>
				<li data-testid="animal">
					<span
						data-testid="name"
						data-fin-text="context.animal.name"
					></span>
					<ul>
						<template data-fin-each--breed="context.animal.breeds">
							<li data-fin-text="context.breed"></li>
						</template>
					</ul>
				</li>
			</template>
			<!-- SSRed elements; they should be removed on hydration -->
			<li data-testid="animal" data-fin-each-child>
				<span data-testid="name">Dog</span>
				<ul>
					<template data-fin-each--breed="context.animal.breeds">
						<li data-fin-text="context.breed"></li>
					</template>
					<li data-fin-each-child>Chihuahua</li>
					<li data-fin-each-child>Rottweiler</li>
				</ul>
			</li>
			<li data-testid="animal" data-fin-each-child>
				<span data-testid="name">Cat</span>
				<ul>
					<template data-fin-each--breed="context.animal.breeds">
						<li data-fin-text="context.breed"></li>
					</template>
					<li data-fin-each-child>Sphynx</li>
					<li data-fin-each-child>Siamese</li>
				</ul>
			</li>
		</ul>
	</div>

	<div data-testid="invalid tag">
		<div data-fin-each="state.letters">
			<p data-fin-text="context.item" data-testid="item"></p>
		</div>
	</div>


	<div data-testid="derived state">
		<button
			data-testid="rotate" data-fin-on--click="actions.rotateFruits"
		>Rotate</button>
		<template
			data-fin-context='{ "idPrefix": "fruit-" }'
			data-fin-each--fruit="state.fruits"
			data-fin-each-key="state.fruitId"
		>
			<p
				data-testid="item"
				data-fin-text="context.fruit"
				data-fin-bind--data-fruit-id="state.fruitId"
			></p>
		</template>
		<!-- SSRed elements; they should be removed on hydration -->
		<p data-testid="item" data-fin-each-child>avocado</p>
		<p data-testid="item" data-fin-each-child>banana</p>
		<p data-testid="item" data-fin-each-child>cherimoya</p>
	</div>
</div>

<hr>

<div
	data-fin-interactive="directive-each"
	data-fin-router-region="navigation-updated list"
	data-fin-context='{ "b": 2, "c": 3, "d": 4 }'
	data-testid="navigation-updated list"
>
	<button
		data-testid="navigate"
		data-fin-on--click="actions.navigate"
	>Navigate</button>
	<template data-fin-each="state.list">
		<p data-fin-text="context.item" data-testid="item"></p>
	</template>
	<p data-testid="item" data-fin-each-child>beta</p>
	<p data-testid="item" data-fin-each-child>gamma</p>
	<p data-testid="item" data-fin-each-child>delta</p>
</div>

<hr>

<div
	data-fin-interactive="directive-each"
	data-fin-context='{ "list": [ "beta" ], "callbackRunCount": 0 }'
	data-testid="elements with directives"
>
	<template data-fin-each="context.list">
		<div
			data-testid="item"
			data-fin-text="context.item"
			data-fin-priority-2-init="callbacks.updateCallbackRunCount"
		></div>
	</template>
	<div
		data-fin-each-child
		data-testid="item"
		data-fin-text="context.item"
		data-fin-priority-2-init="callbacks.updateCallbackRunCount"
	></div>
	<data
		data-testid="callbackRunCount"
		data-fin-text="context.callbackRunCount"
	></data>
</div>

<hr>

<div
	data-fin-interactive="directive-each"
	data-testid="each-with-unset"
>
	<template data-fin-each="state.eachUnset"><p data-fin-text="context.item"></p></template>
</div>
<div
	data-fin-interactive="directive-each"
	data-testid="each-with-null"
>
	<template data-fin-each="state.eachNull"><p data-fin-text="context.item"></p></template>
</div>
<div
	data-fin-interactive="directive-each"
	data-testid="each-with-undefined"
>
	<template data-fin-each="state.eachUndefined"><p data-fin-text="context.item"></p></template>
</div>
<div
	data-fin-interactive="directive-each"
	data-testid="each-with-array"
>
	<template data-fin-each="state.eachArray"><p data-fin-text="context.item"></p></template>
</div>
<div
	data-fin-interactive="directive-each"
	data-testid="each-with-set"
>
	<template data-fin-each="state.eachSet"><p data-fin-text="context.item"></p></template>
</div>
<div
	data-fin-interactive="directive-each"
	data-testid="each-with-string"
>
	<template data-fin-each="state.eachString"><p data-fin-text="context.item"></p></template>
</div>
<div
	data-fin-interactive="directive-each"
	data-testid="each-with-generator"
>
	<template data-fin-each="state.eachGenerator"><p data-fin-text="context.item"></p></template>
</div>
<div
	data-fin-interactive="directive-each"
	data-testid="each-with-iterator"
>
	<template data-fin-each="state.eachIterator"><p data-fin-text="context.item"></p></template>
</div>
