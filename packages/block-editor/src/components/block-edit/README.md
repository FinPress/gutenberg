# Block Edit

The `BlockEdit` component is a core component that provides the editing interface for blocks in the WordPress block editor. It handles block context, layout support, and editing controls visibility.

## Development guidelines

### Usage

The BlockEdit component is typically used as part of the block registration process:

```jsx
import { BlockEdit, useBlockEditContext } from '@wordpress/block-editor';

function MyCustomBlockEdit( props ) {
    const { name, isSelected, clientId } = useBlockEditContext();

    return (
        <BlockEdit
            { ...props }
            mayDisplayControls={ true }
            blockEditingMode="default"
        >
            { /* Block content */ }
        </BlockEdit>
    );
}
```

### Props

#### Core Props

These props are passed through BlockEdit filters and are part of the public API:

#### `name`

-   **Type:** `string`
-   **Required:** Yes

The registered name of the block.

#### `isSelected`

-   **Type:** `boolean`
-   **Default:** `false`

Whether the block is currently selected.

#### `clientId`

-   **Type:** `string`
-   **Required:** Yes

The unique identifier for the block.

#### `attributes`

-   **Type:** `Object`
-   **Default:** `{}`

The block's attributes object.

#### Control Display Props

#### `mayDisplayControls`

-   **Type:** `boolean`
-   **Default:** `undefined`

Whether the block may display its controls.

#### `mayDisplayParentControls`

-   **Type:** `boolean`
-   **Default:** `undefined`

Whether the block's parent may display its controls.

#### `blockEditingMode`

-   **Type:** `string`
-   **Default:** `undefined`

The current editing mode of the block.

#### `isPreviewMode`

-   **Type:** `boolean`
-   **Default:** `undefined`

Whether the block is being rendered in preview mode.

### useBlockEditContext Hook

The `useBlockEditContext` hook provides access to the block's context information. It returns an object containing:

```js
{
    name,           // Block name
    isSelected,     // Selection state
    clientId,       // Block ID
    layout,         // Layout configuration
    __unstableLayoutClassNames // Layout class names
}
```

### Features

1. Context Management
   - Provides block context through `BlockEditContextProvider`
   - Exposes block information via `useBlockEditContext` hook

2. Layout Support
   - Handles block layout configuration
   - Manages layout class names

3. Controls Management
   - Controls visibility of block controls
   - Handles parent block controls

4. Multiple Usage Warning
   - Detects and warns about multiple usage of the same block
   - Provides replacement functionality

### Internal Components

The BlockEdit component uses several internal components:
- `BlockEditContextProvider`: Provides block context
- `Edit`: Core edit component
- `MultipleUsageWarning`: Warning component for multiple block usage

## Related components

Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [`BlockEditorProvider`](https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/provider/README.md) in the components tree.

The BlockEdit component is a fundamental part of the block editor and works with:
- Block toolbar components
- Block controls
- Block selection mechanisms
- Block layout components
