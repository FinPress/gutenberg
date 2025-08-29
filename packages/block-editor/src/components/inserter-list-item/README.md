# InserterListItem

The `InserterListItem` component represents a single item in the inserter listbox, providing functionality for selection, hover, and optional drag-and-drop. It is used to display blocks or patterns within the WordPress editor environment and supports custom styling and behavior through props.

## Usage

```jsx
import { InserterListItem } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';

const item = {
	id: 'core/paragraph',
	title: 'Paragraph',
	icon: { background: '#f3f4f6', foreground: '#000' },
	initialAttributes: { content: 'This is a paragraph block.' },
	innerBlocks: [],
};

const handleSelect = (item) => {
	console.log('Block selected:', item);
};

const handleHover = (item) => {
	console.log('Block hovered:', item);
};

const MyComponent = () => {
	return (
		<InserterListItem
			className="custom-class"
			isFirst={true}
			item={item}
			onSelect={handleSelect}
			onHover={handleHover}
			isDraggable={true}
		/>
	);
};
```

## Props

### `className`

-   **Type:** `string`
-   **Default:** `''`

Additional CSS class to apply to the list item.

### `isFirst`

-   **Type:** `boolean`
-   **Default:** `false`

Indicates whether this is the first item in its row.

### `item`

-   **Type:** `Object`
-   **Default:** `{}`

The block or pattern item to display. Should include properties like `id`, `title`, `icon`, `initialAttributes`, and `innerBlocks`.

### `onSelect`

-   **Type:** `Function`
-   **Default:** `null`

Callback function invoked when the item is selected. Receives the selected item as an argument.

### `onHover`

-   **Type:** `Function`
-   **Default:** `null`

Callback function invoked when the item is hovered or hover ends.

### `isDraggable`

-   **Type:** `boolean`
-   **Default:** `false`

Whether dragging is enabled for this item.

### `props`

-   **Type:** `Object`
-   **Default:** `{}`

Optional additional props for customization, passed to the `InserterListboxItem`.

## Notes

- This component is typically used within the `InserterListboxGroup` to represent individual blocks or patterns.
- Drag-and-drop functionality is disabled if `isDraggable` is `false` or the item is marked as disabled.