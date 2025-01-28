# Block Draggable

The `BlockDraggable` component enables drag and drop functionality for blocks in the editor. It handles block dragging behavior, transfer data, scroll management, and provides visual feedback during drag operations.

## Development guidelines

### Usage

Renders a draggable wrapper around block content with drag and drop capabilities.

```jsx
import { BlockDraggable } from '@wordpress/block-editor';

function MyDraggableBlock( { clientIds } ) {
    return (
        <BlockDraggable
            clientIds={ clientIds }
            cloneClassname="my-draggable-block"
            onDragStart={ () => console.log( 'Started dragging' ) }
            onDragEnd={ () => console.log( 'Ended dragging' ) }
        >
            { ( { draggable, onDragStart, onDragEnd } ) => (
                <div
                    draggable={ draggable }
                    onDragStart={ onDragStart }
                    onDragEnd={ onDragEnd }
                >
                    Block Content
                </div>
            ) }
        </BlockDraggable>
    );
}
```

### Props

#### `clientIds`

-   **Type:** `Array`
-   **Required:** Yes

Array of block client IDs to be dragged.

#### `children`

-   **Type:** `Function`
-   **Required:** Yes

Render prop that provides draggable props to be spread onto the draggable element.

#### `cloneClassname`

-   **Type:** `string`
-   **Default:** `undefined`

Additional className to add to the clone element while dragging.

#### `elementId`

-   **Type:** `string`
-   **Default:** `undefined`

Unique identifier for the draggable element.

#### `onDragStart`

-   **Type:** `Function`
-   **Default:** `undefined`

Callback function executed when dragging starts.

#### `onDragEnd`

-   **Type:** `Function`
-   **Default:** `undefined`

Callback function executed when dragging ends.

#### `fadeWhenDisabled`

-   **Type:** `boolean`
-   **Default:** `false`

Whether to show a faded state when dragging is disabled.

#### `dragComponent`

-   **Type:** `Component`
-   **Default:** `<BlockDraggableChip />`

Component to render while dragging. Set to `null` to disable the default drag component.

#### `appendToOwnerDocument`

-   **Type:** `boolean`
-   **Default:** `undefined`

Whether to append the clone to the owner document while dragging.

### Features

The BlockDraggable component provides:

1. Drag and Drop Management
   - Handles drag start/end events
   - Manages block selection state during drag
   - Provides visual feedback during drag operations

2. Scroll Behavior
   - Automatic scrolling when dragging near edges
   - Smooth scroll animations

3. Validation
   - Checks for valid drop targets
   - Updates visual feedback based on target validity

4. Clone Customization
   - Customizable drag preview
   - Support for custom classnames

5. Accessibility
   - Proper ARIA attributes
   - Keyboard interaction support

### Transfer Data

The component automatically handles transfer data in the format:
```js
{
    type: 'block',
    srcClientIds: Array, // Array of block client IDs
    srcRootClientId: string // Root block client ID
}
```

## Related components

Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [`BlockEditorProvider`](https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/provider/README.md) in the components tree.

The BlockDraggable component typically works in conjunction with:
- `BlockDraggableChip`: Default drag preview component
- `Draggable`: Base draggable component from `@wordpress/components`
- `BlockList`: Container for draggable blocks
