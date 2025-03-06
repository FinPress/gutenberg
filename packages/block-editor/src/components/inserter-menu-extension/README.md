# Inserter Menu Extension

The `InserterMenuExtension` component provides a slot/fill mechanism to extend the block inserter menu with additional content. This unstable API allows developers to inject custom UI elements into the block inserter menu.

## Development guidelines

### Usage

```jsx
import InserterMenuExtension from '@wordpress/block-editor';

// Adding content to the inserter menu
const MyInserterExtension = () => (
    <InserterMenuExtension>
        <div>Custom Inserter Content</div>
    </InserterMenuExtension>
);

// Rendering the slot where extensions will appear
const InserterWithExtensions = () => (
    <div className="block-editor-inserter">
        <InserterMenuExtension.Slot />
    </div>
);
```

### Component Structure

The component uses WordPress's SlotFill system with:
- A `Fill` component (`InserterMenuExtension`)
- A corresponding `Slot` component (`InserterMenuExtension.Slot`)

### Props

The component accepts all props that can be passed to a standard SlotFill component.

### Important Notes

- This is an unstable API as indicated by the `__unstable` prefix
- Changes might occur in future versions
- Should be used with caution in production environments

## Related Components

Block Editor components are components that can be used to compose the UI of your block editor. They should be used under a [`BlockEditorProvider`](https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/provider/README.md) in the components tree.
