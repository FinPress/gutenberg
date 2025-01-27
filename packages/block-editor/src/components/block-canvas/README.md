# Block Canvas

The `BlockCanvas` component is used to display the canvas of the block editor. The canvas is an iframe containing the block list that can be manipulated. The component handles keyboard navigation across blocks and injects content styles into the iframe.

## Development guidelines

### Usage

Renders a block editor canvas with configurable height and custom styles.

```jsx
import { BlockCanvas } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';

function MyBlockEditor() {
    const [ blocks, updateBlocks ] = useState([]);
    return (
        <BlockEditorProvider
            value={ blocks }
            onInput={ updateBlocks }
            onChange={ persistBlocks }
        >
            <BlockCanvas
                height="400px"
                styles={ customStyles }
            />
        </BlockEditorProvider>
    );
}
```

### Props

#### `height`

-   **Type:** `string`
-   **Default:** `'300px'`

The height of the canvas container.

#### `styles`

-   **Type:** `Array`
-   **Default:** `undefined`

An array of custom styles to be injected into the iframe.

#### `children`

-   **Type:** `Element`
-   **Default:** `<BlockList />`

Content to be rendered within the canvas. By default, renders the `BlockList` component.

### ExperimentalBlockCanvas

An experimental version of BlockCanvas is also available with additional features:

```jsx
import { ExperimentalBlockCanvas } from '@wordpress/block-editor';
```

#### Additional Props for ExperimentalBlockCanvas

#### `shouldIframe`

-   **Type:** `boolean`
-   **Default:** `true`

Controls whether the content should be rendered within an iframe.

#### `contentRef`

-   **Type:** `Object`
-   **Default:** `undefined`

Reference to the content container element.

#### `iframeProps`

-   **Type:** `Object`
-   **Default:** `undefined`

Additional props to be passed to the iframe element when `shouldIframe` is true.

### Features

The BlockCanvas component provides:

1. Keyboard Navigation
   - Enables keyboard navigation across blocks in the editor

2. Style Injection
   - Handles content style injection into the iframe
   - Supports custom style transformations

3. Responsive Behavior
   - Adapts to different viewport sizes
   - Supports zoom levels with proper scaling

4. Writing Flow
   - Integrates with the WritingFlow component for seamless editing
   - Maintains proper focus and selection states

## Related components

Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [`BlockEditorProvider`](https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/provider/README.md) in the components tree.

The BlockCanvas component typically works in conjunction with:
- `BlockList`: Default child component for rendering blocks
- `BlockTools`: Wrapper component providing block manipulation capabilities
- `WritingFlow`: Handles writing flow and keyboard navigation
- `EditorStyles`: Manages editor styling
