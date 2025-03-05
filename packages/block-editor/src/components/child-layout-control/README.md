
# Child Layout Control

A component that provides a form to edit the child layout of a block.


## Table of contents

1. [Development guidelines](#development-guidelines)
2. [Related components](#related-components)


## Development guidelines

### Usage

```jsx

import { ChildLayoutControl } from '@wordpress/block-editor';

const MyChildLayoutControl = () => {
   const childLayout = {
        alignment: 'left',
        spacing: {
            top: 10,
            bottom: 10,
        },
   }
	const setChildLayout = ( newChildLayout ) => {
        // Update the child layout value.
    };

    return (
        <ChildLayoutControl
            value={ childLayout }
            onChange={ setChildLayout }
            parentLayout={ {
                alignment: 'left',
                spacing: {
                    top: 10,
                    bottom: 10,
                },
            } }
            isShownByDefault={ true }
            panelId="child-layout-control"
        />
    );
};
```

### Props

### value 

- **Type**: `Object`
- **Required**: Yes
- **Default**: `{}`

The child layout value.

### onChange

- **Type**: `Function`
- **Required**: Yes

Function called when the child layout value changes.

### parentLayout

- **Type**: `Object`
- **Required**: Yes

The parent layout value.

### isShownByDefault

- **Type**: `Boolean`
- **Required**: No

Whether the control should be shown by default.

### panelId

- **Type**: `String`
- **Required**: Yes

The panel ID.

## Related components
Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [BlockEditorProvider](https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/provider/README.md) in the components tree.