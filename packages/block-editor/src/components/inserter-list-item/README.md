## Inserter List Item

The `InserterListItem` component renders an item in the block inserter list, allowing users to add blocks to their content.

This component is used within the block editor to display available blocks that can be inserted into the post or page content.

![Inserter List Item](https://make.wordpress.org/core/files/2020/09/inserter-list-item.png)

## Development guidelines

### Usage

Renders an inserter list item for a block.

```jsx
import { InserterListItem } from '@wordpress/block-editor';

const MyInserterListItem = () => (
	<InserterListItem
		clientId={ clientId }
		isAppender={ isAppender }
		onSelect={ onSelect }
	/>
);
```

### Props

### `clientId`

-   **Type:** `String`
-   **Default:** `undefined`

The client ID of the block to be inserted.

### `isAppender`

-   **Type:** `Boolean`
-   **Default:** `false`

Whether the item is an appender.

### `onSelect`

-   **Type:** `Function`

A callback function invoked when the inserter list item is selected. Called with the client ID of the selected block as the only argument.

## Related components

Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [`BlockEditorProvider`](https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/provider/README.md) in the components tree.
