
# Block Styles 

This `BlockStyles` component displays available block styles in the Settings Sidebar, allowing users to preview and switch between them.


## Table of contents

1. [Development guidelines](#development-guidelines)
2. [Related components](#related-components)


## Development guidelines

### Usage
```jsx
import { BlockStyles } from '@wordpress/block-editor';

const MyBlockStyles = () => (
    <BlockStyles
        clientId="block_123"
        onSwitch={ ( styleName ) => {
            // Handle style switch
        } }
        onHoverClassName={ ( styleName ) => {
            // Handle hover class name
        } }
    />
);
```

### Props

### `clientId`

**Type**: `string`

The block client ID.

### `onSwitch`

**Type**: `Function`
**Default**: noop

A function that is called when a block style is selected.

### `onHoverClassName`

**Type**: `Function`
**Default**: noop

A function that is called when a block style is hovered.

## Related components
Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [BlockEditorProvider](https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/provider/README.md) in the components tree.