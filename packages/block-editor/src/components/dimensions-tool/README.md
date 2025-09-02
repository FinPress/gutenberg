# Dimensions Tool

The Dimensions Tool is a component that renders controls to edit the dimensions of an image or container.

## Table of contents

1. [Development guidelines](#development-guidelines)
2. [Related components](#related-components)

## Development guidelines

### Usage

Render the `DimensionsTool` component within the block editor's UI to allow users to edit the dimensions of an image or container.

```jsx
import { DimensionsTool } from '@wordpress/block-editor';

const MyDimensionsTool = () => {
    return (
        <DimensionsTool
            value={ {
                width: 100,
                height: 100,
            } }
            onChange={ ( nextDimensions ) => {
                // Handle the new dimensions.
            } }
            aspectRatioOptions={ [
                { value: 'auto', label: 'Auto' },
                { value: '1:1', label: 'Square' },
                { value: '16:9', label: 'Widescreen' },
            ] },
            defaultAspectRatio="auto"
            scaleOptions={ [
                { value: 'fill', label: 'Fill' },
                { value: 'fit', label: 'Fit' },
            ] }
            defaultScale="fill"
            unitsOptions={ [
                { value: 'px', label: 'px' },
                { value: '%', label: '%' },
            ] }
            tools={ [ 'aspectRatio', 'widthHeight', 'scale' ] }
        />
    );
};

```

### Props

### `value`

-   **Type**: `Object`
-   **Default**: `{}`

The current dimensions of the image or container.

### `onChange`

-   **Type**: `Function`
-   **Default**: `() => {}`

A function that receives the new dimensions when they change.

### `aspectRatioOptions`

-   **Type**: `Array`

An array of objects representing the aspect ratio options available to the user. Each object should have a `value` and a `label`.

### `defaultAspectRatio`

-   **Type**: `String`
-   **Default**: `'auto'`

The default aspect ratio value.

### `scaleOptions`

-   **Type**: `Array`

An array of objects representing the scale options available to the user. Each object should have a `value` and a `label`.

### `defaultScale`

-   **Type**: `String`
-   **Default**: `'fill'`

The default scale value.

### `unitsOptions`

-   **Type**: `Array`

An array of objects representing the units options available to the user. Each object should have a `value` and a `label`.

### `tools`

-   **Type**: `Array`
-   **Default**: `[ 'aspectRatio', 'widthHeight', 'scale' ]`

An array of strings representing the tools to display. The available tools are `'aspectRatio'`, `'widthHeight'`, and `'scale'`.

## Related components

Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [BlockEditorProvider](https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/provider/README.md) in the components tree.
