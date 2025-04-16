# HTML Element Select Control

A specialized component for selecting HTML elements with validation to prevent duplicate `<main>` elements.

The `HTMLElementSelectControl` is an extension of the WordPress `SelectControl` component that adds validation to prevent duplicate `<main>` HTML elements. This component is designed to help ensure valid HTML structure and improve accessibility in content created with the WordPress block editor.

> **Note:** This component is available via private APIs using the unlock pattern. It is not directly exposed as a public API.

## Development guidelines

### Usage

```jsx
import { privateApis as blockEditorPrivateApis } from '@wordpress/block-editor';
import { unlock } from './lock-unlock';

const { HTMLElementSelectControl } = unlock( blockEditorPrivateApis );

function MyBlockEdit( { attributes, setAttributes, clientId } ) {
    const { tagName } = attributes;
    
    return (
        <InspectorControls group="advanced">
            <HTMLElementSelectControl
                tagName={ tagName }
                onChange={ ( value ) => setAttributes( { tagName: value } ) }
                clientId={ clientId }
                checkForMainTag={ true } /* Optional, defaults to true */
                options={ [
                    { label: 'Default (<div>)', value: 'div' },
                    { label: '<header>', value: 'header' },
                    { label: '<main>', value: 'main' },
                    { label: '<section>', value: 'section' },
                    { label: '<article>', value: 'article' },
                    { label: '<aside>', value: 'aside' },
                    { label: '<footer>', value: 'footer' },
                ] }
            />
        </InspectorControls>
    );
}
```

### Props

#### `tagName`

-   **Type:** `String`

The current HTML tag name selected for the block.

#### `onChange`

-   **Type:** `Function`

A callback function that is invoked when the user selects a different HTML element.

#### `clientId`

-   **Type:** `String`

The client ID of the current block. Used for validating element uniqueness across blocks.

#### `options`

-   **Type:** `Array`
-   **Default:** Standard HTML elements (div, header, main, section, article, aside, footer)

An array of options for the select control. Each option should contain a `label` and `value` property.

#### `checkForMainTag`

-   **Type:** `Boolean`
-   **Default:** `true`

Whether to check for duplicate `<main>` tags. Set to `false` for blocks that don't offer the `<main>` tag as an option for performance optimization.