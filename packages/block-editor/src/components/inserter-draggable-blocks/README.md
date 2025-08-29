# InserterDraggableBlocks

The `InserterDraggableBlocks` component provides functionality to make WordPress blocks or patterns draggable within the editor environment. This component leverages the `Draggable` component from `@wordpress/components` and allows customization of drag-and-drop behavior through props.

## Usage

```jsx
import { InserterDraggableBlocks } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';

const blocks = [
	createBlock( 'core/paragraph', { content: 'This is a paragraph block.' } ),
	createBlock( 'core/heading', {
		content: 'This is a heading block.',
		level: 2,
	} ),
];

const MyComponent = () => {
	return (
		<InserterDraggableBlocks
			isEnabled={ true }
			blocks={ blocks }
			icon={ <span>Drag</span> }
			children={ ( { draggable, onDragStart, onDragEnd } ) => (
				<div
					draggable={ draggable }
					onDragStart={ onDragStart }
					onDragEnd={ onDragEnd }
				>
					Drag Me!
				</div>
			) }
		/>
	);
};
```

## Props

### `isEnabled`

-   **Type:** `boolean`
-   **Default:** `false`

Whether dragging is enabled.

### `blocks`

-   **Type:** `Array`
-   **Default:** `[]`

Array of blocks to make draggable.

### `icon`

-   **Type:** `ReactNode`
-   **Default:** `null`

Icon for the draggable chip.

### `children`

-   **Type:** `Function`
-   **Default:** `null`

Render function for child elements. Receives draggable props (`draggable`, `onDragStart`, `onDragEnd`).

### `pattern`

-   **Type:** `Object`
-   **Default:** `null`

Optional block pattern for drag-and-drop. Should include `type`, `syncStatus`, and `id` attributes.
