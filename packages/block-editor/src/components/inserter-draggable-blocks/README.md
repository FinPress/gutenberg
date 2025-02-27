
# InserterDraggableBlocks

The InserterDraggableBlocks component is a component that renders a list of draggable blocks that can be inserted into the editor. It is used in the Inserter component.


## Table of contents

1. [Development guidelines](#development-guidelines)
2. [Related components](#related-components)


## Development guidelines

### Usage

Renders a list of draggable blocks that can be inserted into the editor.

```jsx
import { InserterDraggableBlocks } from '@wordpress/block-editor';

const MyInserterDraggableBlocks = () => (
    return (
        <InserterDraggableBlocks
            blocks={ blocks }
            icon={ icon }
            isEnabled={ isEnabled }
            pattern={ pattern }
        />
    );
);
```

### Props

### isEnabled

**Type**: `boolean`

Whether the inserter is enabled or not.

### blocks

**Type**: `Array`

An array of blocks to be rendered in the inserter.

### icon

**Type**: `string`

The icon to be rendered in the inserter.

### children

**Type**: `React.ReactNode`

The children to be rendered in the inserter.

### pattern

**Type**: `string`

The pattern to be rendered in the inserter.


## Related components
Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [BlockEditorProvider](https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/provider/README.md) in the components tree.