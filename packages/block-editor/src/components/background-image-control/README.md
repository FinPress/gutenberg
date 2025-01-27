# Background Image Control

The `BackgroundImagePanel` component provides a complete UI for managing background images in the block editor, including image upload, positioning, sizing, and repeat controls.

## Development guidelines

### Usage

Renders a background image control panel with image upload functionality and various image settings.

```jsx
import { BackgroundImagePanel } from '@wordpress/block-editor';

const MyBackgroundImageControl = () => (
    <BackgroundImagePanel
        value={ backgroundStyles }
        onChange={ updateBackgroundStyles }
        settings={ {
            background: {
                backgroundSize: true,
                backgroundPosition: true,
                backgroundRepeat: true
            }
        } }
    />
);
```

### Props

#### `value`

-   **Type:** `Object`
-   **Default:** `undefined`

The current background image settings object. May include the following properties:
- `background.backgroundImage`: Object containing image details (url, id, title, source)
- `background.backgroundSize`: String ('cover', 'contain', 'auto', or custom size)
- `background.backgroundPosition`: String (e.g., '50% 50%')
- `background.backgroundRepeat`: String ('repeat' or 'no-repeat')
- `background.backgroundAttachment`: String ('scroll' or 'fixed')

#### `onChange`

-   **Type:** `Function`
-   **Required:** Yes

Callback function invoked when any background image setting changes. Receives the updated settings object as its argument.

#### `inheritedValue`

-   **Type:** `Object`
-   **Default:** `value`

The inherited background image settings that will be used as fallback values.

#### `settings`

-   **Type:** `Object`
-   **Default:** `undefined`

Configuration object to enable/disable specific background controls:
- `background.backgroundSize`: Boolean
- `background.backgroundPosition`: Boolean
- `background.backgroundRepeat`: Boolean

#### `defaultValues`

-   **Type:** `Object`
-   **Default:** `{}`

Default values to use for background image settings when not specified.

### Features

The component provides the following features:

1. Image Upload/Replace
   - Drag and drop support
   - Media library integration
   - Image removal

2. Image Settings
   - Focal point picker for position control
   - Size options (Cover, Contain, Tile)
   - Custom size input with unit control
   - Repeat toggle
   - Fixed background toggle

3. Preview
   - Shows selected image thumbnail
   - Displays image filename or title
   - Live preview of position changes

## Related components

Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [`BlockEditorProvider`](https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/provider/README.md) in the components tree.
