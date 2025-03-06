# Block Drop Hook

The `useOnBlockDrop` hook provides functionality for handling block drag and drop operations in the WordPress block editor, including dropping blocks, files, and HTML content.

## Development guidelines

### Usage

```jsx
import { useOnBlockDrop } from '@wordpress/block-editor';

const MyDropTarget = ({ clientId, index }) => {
    const onDrop = useOnBlockDrop(clientId, index, {
        operation: 'insert',
        nearestSide: 'right'
    });

    return (
        <div onDrop={onDrop}>
            {/* Drop target content */}
        </div>
    );
};
```

### Hook Parameters

#### `targetRootClientId`
- **Type:** `string`
- **Description:** The client ID of the block where dropped content will be inserted

#### `targetBlockIndex`
- **Type:** `number`
- **Description:** The index position where dropped content will be inserted

#### `options`
- **Type:** `Object`
- **Properties:**
  - `operation` (`'insert'|'replace'|'group'`): The type of operation to perform
  - `nearestSide` (`'left'|'right'`): Which side to insert relative to target

### Supported Drop Types

#### Block Drops
- Move existing blocks
- Insert new blocks from inserter
- Group blocks when dropped on each other
- Prevent recursive nesting

#### File Drops
- Handle media file uploads
- Transform files to appropriate blocks
- Respect media upload settings

#### HTML Drops
- Parse HTML content into blocks
- Insert converted blocks at target location

### Example Implementation

```jsx
import { useOnBlockDrop } from '@wordpress/block-editor';

const BlockDropZone = ({ rootClientId, index }) => {
    const onDrop = useOnBlockDrop(rootClientId, index, {
        operation: 'group',
        nearestSide: 'right'
    });

    return (
        <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            Drop blocks here
        </div>
    );
};
```

## Related Components

Block Editor components are components that can be used to compose the UI of your block editor. They should be used under a [`BlockEditorProvider`](https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/provider/README.md) in the components tree.
