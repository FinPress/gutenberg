<?php
/**
 * HTML for testing the directive `data-fp-context`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div data-fp-interactive='{"namespace": "directive-context"}'>
	<div
		data-fp-context='{ "prop1":"parent","prop2":"parent","obj":{"prop4":"parent","prop5":"parent"},"array":[1,2,3] }'
	>
		<pre
			data-testid="parent context"
			data-fp-bind--children="state.renderContext"
		>
			<!-- rendered during hydration -->
		</pre>
		<button data-testid="parent replace" data-fp-on--click="actions.replaceObj">Replace obj</button>
		<button
			data-testid="parent prop1"
			name="prop1"
			value="modifiedFromParent"
			data-fp-on--click="actions.updateContext"
		>
			prop1
		</button>
		<button
			data-testid="parent prop2"
			name="prop2"
			value="modifiedFromParent"
			data-fp-on--click="actions.updateContext"
		>
			prop2
		</button>
		<button
			data-testid="parent obj.prop4"
			name="obj.prop4"
			value="modifiedFromParent"
			data-fp-on--click="actions.updateContext"
		>
			obj.prop4
		</button>
		<button
			data-testid="parent obj.prop5"
			name="obj.prop5"
			value="modifiedFromParent"
			data-fp-on--click="actions.updateContext"
		>
			obj.prop5
		</button>
		<button
			data-testid="parent new"
			name="new"
			value="modifiedFromParent"
			data-fp-on--click="actions.updateContext"
		>
			new
		</button>
		<div
			data-fp-context='{ "prop2":"child","prop3":"child","obj":{"prop5":"child","prop6":"child"},"array":[4,5,6] }'
		>
			<pre
				data-testid="child context"
				data-fp-bind--children="state.renderContext"
			>
				<!-- rendered during hydration -->
			</pre>
			<button data-testid="child replace" data-fp-on--click="actions.replaceObj">Replace obj</button>
			<button
				data-testid="child prop1"
				name="prop1"
				value="modifiedFromChild"
				data-fp-on--click="actions.updateContext"
			>
				prop1
			</button>
			<button
				data-testid="child prop2"
				name="prop2"
				value="modifiedFromChild"
				data-fp-on--click="actions.updateContext"
			>
				prop2
			</button>
			<button
				data-testid="child prop3"
				name="prop3"
				value="modifiedFromChild"
				data-fp-on--click="actions.updateContext"
			>
				prop3
			</button>
			<button
				data-testid="child obj.prop4"
				name="obj.prop4"
				value="modifiedFromChild"
				data-fp-on--click="actions.updateContext"
			>
				obj.prop4
			</button>
			<button
				data-testid="child obj.prop5"
				name="obj.prop5"
				value="modifiedFromChild"
				data-fp-on--click="actions.updateContext"
			>
				obj.prop5
			</button>
			<button
				data-testid="child obj.prop6"
				name="obj.prop6"
				value="modifiedFromChild"
				data-fp-on--click="actions.updateContext"
			>
				obj.prop6
			</button>
			<button
				data-testid="child copy obj"
				data-fp-on--click="actions.copyObj"
			>
				Copy obj
			</button>
			<div>
				Is proxy preserved? <span
					data-testid="is proxy preserved"
					data-fp-text="state.isProxyPreserved"
				></span>
			</div>
			<div>
				Is proxy preserved on copy? <span
					data-testid="is proxy preserved on copy"
					data-fp-text="state.isProxyPreservedOnCopy"
				></span>
			</div>
		</div>
		<br />

		<button
			data-testid="context & other directives"
			data-fp-context='{ "text": "Text 1" }'
			data-fp-text="context.text"
			data-fp-on--click="actions.toggleContextText"
			data-fp-bind--value="context.text"
		>
			Toggle Context Text
		</button>
	</div>
</div>

<div
	data-fp-interactive='{"namespace": "directive-context-navigate"}'
	data-fp-router-region="navigation"
	data-fp-context='{ "text": "first page" }'
>
	<div data-fp-context='{}'>
		<div data-testid="navigation inherited text" data-fp-text="context.text"></div>
		<div data-testid="navigation inherited text2" data-fp-text="context.text2"></div>
	</div>
	<div data-testid="navigation text" data-fp-text="context.text"></div>
	<div data-testid="navigation new text" data-fp-text="context.newText"></div>
	<button data-testid="toggle text" data-fp-on--click="actions.toggleText">Toggle Text</button>
	<button data-testid="add new text" data-fp-on--click="actions.addNewText">Add New Text</button>
	<button data-testid="add text2" data-fp-on--click="actions.addText2">Add Text 2</button>
	<button data-testid="navigate" data-fp-on--click="actions.navigate">Navigate</button>
	<button data-testid="async navigate" data-fp-on--click="actions.asyncNavigate">Async Navigate</button>
</div>

<div
	data-fp-interactive='{"namespace": "directive-context-non-default"}'
	data-fp-context--non-default='{ "text": "non default" }'
	data-fp-context='{ "defaultText": "default" }'
>
	<span data-testid="non-default suffix context" data-fp-text="context.text"></span>
	<span data-testid="default suffix context" data-fp-text="context.defaultText"></span>
</div>

<div
	data-fp-interactive='directive-context'
	data-fp-context='{ "list": [
		{ "id": 1, "text": "Text 1" },
		{ "id": 2, "text": "Text 2" }
	] }'
>
	<button data-testid="select 1" data-fp-on--click="actions.selectItem" value=1>Select 1</button>
	<button data-testid="select 2" data-fp-on--click="actions.selectItem" value=2>Select 2</button>
	<div data-testid="selected" data-fp-text="state.selected"></div>
</div>

<div
	data-fp-interactive="directive-context-watch"
	data-fp-context='{"counter":0}'
>
	<button
		data-testid="counter parent"
		data-fp-on--click="actions.increment"
		data-fp-text="context.counter"
	></button>
	<div
		data-fp-context='{"counter":0, "changes":0}'
		data-fp-watch="callbacks.countChanges"
	>
		<button
			data-testid="counter child"
			data-fp-on--click="actions.increment"
			data-fp-text="context.counter"
		>
		</button>
		<span
			data-testid="counter changes"
			data-fp-text="context.changes"
		></span>
	</div>
</div>


<div
	data-testid="inheritance from other namespaces"
	data-fp-interactive="directive-context/parent"
	data-fp-context='{ "prop": "fromParentNs" }'
>
	<div
		data-fp-interactive="directive-context/child"
		data-fp-context='{ "prop": "fromChildNs" }'
	>
		<span
			data-testid="parent"
			data-fp-text="directive-context/parent::context.prop"
		></span>
		<span
			data-testid="child"
			data-fp-text="directive-context/child::context.prop"
		></span>
	</div>
</div>
