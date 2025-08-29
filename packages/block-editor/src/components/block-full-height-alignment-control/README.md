# Block Full Height Alignment Control

The Block Full Height Alignment Control allows users to toggle full height alignment for blocks. Unlike standard block alignment options, this control specifically manages the vertical height behavior of a block, making it span the full height of its container.

## Development guidelines

### Usage

```jsx
import { BlockFullHeightAlignmentControl } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';

function MyBlockEdit() {
    const [ isFullHeight, setIsFullHeight ] = useState( false );
    
    return (
        <BlockControls>
            <BlockFullHeightAlignmentControl
                isActive={ isFullHeight }
                onToggle={ setIsFullHeight }
            />
        </BlockControls>
    );
}
```

### Props

### `isActive`

- **Type:** `boolean`
- **Default:** `false`

Controls whether the full height alignment is currently active.

### `label`

- **Type:** `string`
- **Default:** `'Full height'`

Label for the toolbar button.

### `onToggle`

- **Type:** `Function`
- **Default:** `undefined`

Callback function triggered when the alignment is toggled.

### `isDisabled`

- **Type:** `boolean`
- **Default:** `false`

Whether the control should be disabled.