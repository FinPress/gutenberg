# Block Content Overlay

The `useBlockOverlayActive` hook is used to determine whether a block has an active overlay. This is an internal hook that helps manage block overlay states in the block editor.

## Development guidelines

### Usage

```jsx
import { useBlockOverlayActive } from '@wordpress/block-editor';

function MyBlockComponent( { clientId } ) {
    const hasOverlay = useBlockOverlayActive( clientId );

    return (
        <div className={ hasOverlay ? 'has-overlay' : '' }>
            { /* Block content */ }
        </div>
    );
}
```

### Parameters

#### `clientId`

-   **Type:** `string`
-   **Required:** Yes

The unique identifier of the block to check for an active overlay.

### Return Value

-   **Type:** `boolean`

Returns `true` if the specified block has an active overlay, `false` otherwise.

### Internal Dependencies

This hook relies on the following internal dependencies:
- `blockEditorStore`: The central data store for block editor state
- `__unstableHasActiveBlockOverlayActive`: Internal selector to check overlay state

### Notes

- This is considered an unstable API as indicated by the `__unstable` prefix in the internal selector
- Should be used with caution as the implementation details may change in future releases
- Primarily intended for internal block editor use

## Related Components and Hooks

Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [`BlockEditorProvider`](https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/provider/README.md) in the components tree.

The `useBlockOverlayActive` hook is typically used in conjunction with:
- Block overlay UI components
- Block selection mechanisms
- Block focus management utilities
