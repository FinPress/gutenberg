# Inserter Listbox Row

The `InserterListboxRow` component is part of the Inserter Listbox system that provides horizontal organization for block inserter items. It wraps the Composite.Group component with proper accessibility attributes for screen readers and keyboard navigation.

## Development guidelines

### Usage

```jsx
import { InserterListboxRow } from '@wordpress/block-editor';

const MyBlockList = () => (
    <InserterListboxGroup>
        <InserterListboxRow>
            <InserterListboxItem>Paragraph Block</InserterListboxItem>
            <InserterListboxItem>Heading Block</InserterListboxItem>
            <InserterListboxItem>Image Block</InserterListboxItem>
        </InserterListboxRow>
    </InserterListboxGroup>
);
```

### Props

#### `ref`
- **Type:** `ForwardedRef`
- **Description:** Forward ref to access the DOM node of the row container

#### `children`
- **Type:** `Node`
- **Description:** Components to be rendered within the row

The component also accepts all props supported by `Composite.Group`.

### Structure

The component renders a `Composite.Group` with:
- `role="presentation"` for proper screen reader behavior
- Forwarded ref for DOM access
- Spreads additional props to the underlying group

## Related Components

- `InserterListbox` - The main wrapper component
- `InserterListboxGroup` - Container for organizing rows
- `InserterListboxItem` - Individual selectable items

Must be used under a [`BlockEditorProvider`](https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/provider/README.md).
