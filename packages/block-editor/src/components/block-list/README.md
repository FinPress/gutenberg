# Block List

The `BlockList` component is responsible for rendering a list of blocks within the WordPress block editor. It manages the layout, interactions, and UI behaviors for blocks within the editor interface.

## Usage

This component is used internally within the WordPress block editor and is not typically used directly by block developers. It renders blocks inside a parent container, applying necessary UI behaviors such as selection handling, focus management, and appender display.

### Example

```jsx
import BlockList from '@wordpress/block-editor/components/block-list';

function MyEditorComponent( props ) {
    return (
        <BlockList rootClientId={ props.clientId } />
    );
}
```

## Props

| Prop                      | Type       | Description |
|---------------------------|------------|-------------|
| `rootClientId`            | `string?`  | The client ID of the root block whose inner blocks will be rendered. If omitted, renders the top-level blocks. |
| `placeholder`             | `ReactNode?` | Placeholder content displayed when no blocks are present. |
| `renderAppender`          | `Function?` | Custom function to render an appender component (e.g., the "+" button for adding new blocks). Defaults to the standard block appender. |
| `__experimentalAppenderTagName` | `string?` | Tag name for the appender element. |
| `layout`                  | `Object?`  | The layout configuration for blocks, affecting their positioning and arrangement. |

## Features

- **Block Rendering:** Displays a list of blocks based on the provided `rootClientId`.
- **Selection & Focus Handling:** Manages block selection, focus state, and block visibility.
- **Zoom-Out Mode:** Provides UI behavior for zooming out from nested block structures.
- **Block Editing Mode Integration:** Supports different block editing modes, including content-only editing and disabled states.
- **Block Appender Support:** Displays an appender UI when appropriate, allowing users to insert new blocks.

## Related Components

- [`BlockListBlock`](./block) - Renders individual blocks within the `BlockList`.
- [`BlockListAppender`](../block-list-appender) - Provides UI for adding new blocks.
- [`useInnerBlocksProps`](../inner-blocks) - Hook for managing inner blocks and their props.

## Notes

The `BlockList` component plays a crucial role in structuring the block editor. While it is used internally, developers working on extending or modifying the editor interface may need to interact with it for advanced customization.

