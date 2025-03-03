# Block Manager

The Block Manager component is a component that allows the user to manage the blocks in the editor. It provides a list of blocks that are currently in the editor, and allows the user to select a block to focus on it.

## Table of contents

1. [Development guidelines](#development-guidelines)
2. [Related components](#related-components)

## Development guidelines

### Usage

Renders a block manager component.

```jsx
import { BlockManager } from '@wordpress/block-editor';

const MyBlockManager = () => (
	<BlockManager
		blockTypes={ blockTypes }
		selectedBlockTypes={ selectedBlockTypes }
		onChange={ onChange }
	/>
);
```

### Props

### `blockTypes`

-   **Type:** `Array`

An array of block types that are currently in the editor.

### `selectedBlockTypes`

-   **Type:** `Array`

An array of block types that are currently selected.

### `onChange`

-   **Type:** `Function`

A function that is called when the user selects a block type. It receives an array of block types as an argument.

## Related components

Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [BlockEditorProvider](https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/provider/README.md) in the components tree.
