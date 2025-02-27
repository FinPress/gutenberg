# Block List Appender

The Block List Appender component is a button that allows the user to add a new block to the block list. It is typically used at the end of the block list to allow the user to add a new block after the last block.

## Table of contents

1. [Development guidelines](#development-guidelines)
2. [Related components](#related-components)

## Development guidelines

### Usage

Renders a Block List Appender component.

```jsx
import { BlockListAppender } from '@wordpress/block-editor';

const MyBlockListAppender = () => (
    return (
        <BlockListAppender
            rootClientId="root"
            CustomAppender={ MyCustomAppender }
            className="my-block-list-appender"
            tagName="div"
        />
    );
);
```

### Props

### `rootClientId`

-   Type: `string`
-   Default: `undefined`

The client ID of the root block of the block list to which the new block will be added. If not provided, the new block will be added to the root block of the block editor.

### `CustomAppender`

-   Type: `ComponentType`
-   Default: `undefined`

A custom component to render the block list appender. If provided, the default block list appender will not be rendered.

### `className`

-   Type: `string`
-   Default: `undefined`

A class name to add to the block list appender container.

### `tagName`

-   Type: `TagName`
-   Default: `'div'`

The HTML tag name to use for the block list appender container.

## Related components

Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [BlockEditorProvider](https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/provider/README.md) in the components tree.
