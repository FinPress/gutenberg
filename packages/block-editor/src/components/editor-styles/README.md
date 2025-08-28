# EditorStyles

EditorStyles is a React component that dynamically applies styles to the WordPress editor environment. It handles the injection of custom styles, manages dark theme detection, and supports SVG asset management for the editor interface.


## Usage

```jsx
import { EditorStyles } from '@wordpress/block-editor';

// ...

const MyEditor = () => {
    const customStyles = {
        customStyle: {
            css: 'body { background-color: #f0f0f0; }',
        },
        svgAssets: {
            __unstableType: 'svgs',
            assets: '<svg>...</svg>',
        },
    };

    return (
        <EditorStyles
            styles={customStyles}
            scope=".editor-styles-wrapper"
            transformOptions={{
                prefix: true,
                minify: true,
            }}
        />
    );
};

/// ...

<MyEditor />
```

## Props

The component accepts the following props:

### styles

An object containing editor styles where keys are style IDs and values contain CSS and other assets.

- Type: `Object`
- Required: Yes

The styles object should follow this structure:

| Property | Description | Type |
|----------|-------------|------|
| css | CSS rules to be applied | string |
| __unstableType | Type of style asset (e.g., 'svgs') | string |
| assets | Content for non-CSS assets | string |

### scope

A selector scope for applying styles, determining where in the editor the styles will be injected.

- Type: `string`
- Required: No
- Default: undefined

### transformOptions

Options for transforming the styles before they are applied.

- Type: `Object`
- Required: No

The transformOptions object accepts:

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| prefix | Whether to add prefixes to CSS rules | boolean | false |
| minify | Whether to minify the CSS output | boolean | false |
