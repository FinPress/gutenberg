# Block Edit Visually Button

`BlockEditVisuallyButton` is a component that provides a toolbar button to switch from HTML editing mode to visual editing mode in the WordPress Block Editor (Gutenberg).

## Description

This component renders a toolbar button that allows users to switch from HTML editing mode back to the visual editor. The button only appears when a single block is selected and is currently in HTML editing mode.

## Installation

This component is available as part of the `@wordpress/block-editor` package and can be imported as:

```js
import { BlockEditVisuallyButton } from '@wordpress/block-editor';
```

## Properties

### Required Props

- `clientIds` (array): An array of block client IDs. The button will only be shown when exactly one block is selected (array length === 1).

## Usage

```jsx
function MyBlockToolbar({ clientIds }) {
  return (
    <BlockControls>
      <BlockEditVisuallyButton clientIds={clientIds} />
    </BlockControls>
  );
}
```

## Behavior

- The button is only rendered when:
  - Exactly one block is selected
  - The selected block is currently in HTML editing mode
- Clicking the button toggles the block's editing mode from HTML to visual
- The button is automatically hidden when in visual editing mode

## Dependencies

This component uses:

- `@wordpress/components`: For `ToolbarButton` and `ToolbarGroup`
- `@wordpress/i18n`: For internationalization
- `@wordpress/data`: For state management
- Block editor store

## Related Components

- `BlockModeToggle`: Complementary component that handles switching from visual to HTML mode
- `BlockControls`: Parent component where this button is typically rendered

## Notes

- Uses the block editor data store to check and toggle block modes
- Internationalization ready with default text "Edit visually"
- Part of the block toolbar UI components suite
