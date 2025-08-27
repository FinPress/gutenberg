# Block Content Overlay

The `useBlockOverlayActive` hook provides functionality to determine if a block has an active overlay state. This is used to control block interaction and styling when certain operations are being performed on the block.

## Development guidelines

### Usage

```jsx
import { useBlockOverlayActive } from '@wordpress/block-editor';

const MyBlockComponent = ({ clientId }) => {
    const hasOverlay = useBlockOverlayActive(clientId);

    return (
        <div className={hasOverlay ? 'has-block-overlay' : ''}>
            {/* Block content */}
        </div>
    );
};
```

### Hook Parameters

#### `clientId`
- **Type:** `String`
- **Required:** Yes
- **Description:** The unique identifier for the block

### Return Value

- **Type:** `Boolean`
- **Description:** Returns true if the block has an active overlay, false otherwise

### Styling

The component comes with default styles that handle the overlay appearance:

```scss
.block-editor-block-list__block.has-block-overlay {
    cursor: default;

    // Disable pointer events on nested blocks
    .block-editor-block-list__block {
        pointer-events: none;
    }
}
```

### Important Notes

- This is an unstable API as indicated by the `__unstable` prefix in the store selector
- The overlay state affects both the visual appearance and interaction behavior of blocks
- Nested blocks within an overlay-active block will have pointer events disabled

## Related Components

Block Editor components are components that can be used to compose the UI of your block editor. They should be used under a [`BlockEditorProvider`](https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/provider/README.md) in the components tree.
