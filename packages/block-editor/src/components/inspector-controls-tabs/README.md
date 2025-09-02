# Inspector Controls Tabs

Inspector Controls Tabs is a component that allows you to create a tabbed interface for the inspector controls.

## Table of contents

1. [Development guidelines](#development-guidelines)
2. [Related components](#related-components)

## Development guidelines

### Usage

Render a tabbed interface for the inspector controls

```jsx
import { InspectorControlsTabs } from '@wordpress/block-editor';

const MyInspectorControls = () => (

    const availableTabs = useInspectorControlsTabs( 'core/paragraph' );

    <InspectorControlsTabs
       blockName="core/paragraph"
       clientId="block_1"
       hasBlockStyles={true}
       tabs={ availableTabs }
    />
);
```

### Props

### `blockName`

-   **Type**: `string`
-   **Required**: Yes

The name of the block that the inspector controls are for.

### `clientId`

-   **Type**: `string`
-   **Required**: Yes

The client ID of the block that the inspector controls are for.

### `hasBlockStyles`

-   **Type**: `boolean`
-   **Required**: Yes

Whether the block has block styles.

### `tabs`

-   **Type**: `Array`
-   **Required**: Yes

An array of objects representing the tabs to be displayed.

## Related components

Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [BlockEditorProvider](https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/provider/README.md) in the components tree.
