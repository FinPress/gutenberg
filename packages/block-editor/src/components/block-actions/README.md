# Block Actions

`BlockActions` is a higher-order component that provides a set of common block manipulation actions and their corresponding state for use within the WordPress Block Editor (Gutenberg).

## Description

The `BlockActions` component accepts an array of block client IDs and provides a render prop with various block manipulation capabilities and their corresponding state. This component is typically used to implement block toolbar actions and other block manipulation interfaces.

## Installation

This component is available as part of the `@wordpress/block-editor` package and can be imported as:

```js
import { BlockActions } from '@wordpress/block-editor';
```

## Properties

### Required Props

- `clientIds` (array): An array of block client IDs that the actions will affect.
- `children` (function): A render prop function that receives an object containing action handlers and their corresponding state.

### Optional Props

- `__experimentalUpdateSelection` (boolean): When true, updates block selection after certain operations.

## Usage

```jsx
function MyBlockToolbar({ clientIds }) {
  return (
    <BlockActions clientIds={ clientIds }>
      {({
        canDuplicate,
        canRemove,
        canInsertBlock,
        canCopyStyles,
        onDuplicate,
        onRemove,
        onInsertBefore,
        onInsertAfter,
        onGroup,
        onUngroup,
        onCopy,
        onPasteStyles,
      }) => (
        <div className="my-block-toolbar">
          {canDuplicate && (
            <Button onClick={onDuplicate}>Duplicate</Button>
          )}
          {canRemove && (
            <Button onClick={onRemove}>Remove</Button>
          )}
          {/* Add other actions as needed */}
        </div>
      )}
    </BlockActions>
  );
}
```

## Available Actions

The children render prop receives an object with the following properties:

### State Properties

- `canCopyStyles` (boolean): Whether the selected blocks support color or typography styles
- `canDuplicate` (boolean): Whether the blocks can be duplicated
- `canInsertBlock` (boolean): Whether new blocks can be inserted
- `canRemove` (boolean): Whether the blocks can be removed

### Action Handlers

- `onDuplicate()`: Duplicates the selected blocks
- `onRemove()`: Removes the selected blocks
- `onInsertBefore()`: Inserts a new block before the selection
- `onInsertAfter()`: Inserts a new block after the selection
- `onGroup()`: Groups the selected blocks (if grouping is supported)
- `onUngroup()`: Ungroups the selected block (if it's a group)
- `onCopy()`: Copies the selected blocks
- `onPasteStyles()`: Pastes previously copied styles to the selected blocks

## Dependencies

This component internally uses:

- `@wordpress/data`: For state management
- `@wordpress/blocks`: For block manipulation utilities
- Internal block editor store and utilities

## Related Components

- `BlockToolbar`: Uses `BlockActions` to provide the standard block toolbar interface
- `BlockMover`: Often used alongside `BlockActions` for block arrangement

## Notes

- The component uses the block editor data store to manage block state and operations
- Some actions (like grouping) depend on block support features
- Visual feedback (block flashing) is provided for certain operations like copying
- Style operations respect block support flags for color and typography
