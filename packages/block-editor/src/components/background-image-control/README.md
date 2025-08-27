# Background Image Control

The `background-image-control` component provides an interface for selecting, positioning, and configuring background images in the WordPress block editor.

## Features
- Upload or select a background image from the media library.
- Adjust background position using a focal point picker.
- Toggle background repeat and attachment properties.
- Set background size (cover, contain, auto, or custom units).
- Remove or replace the background image.
- Drag and drop image uploads.

## Installation
This component is part of the Gutenberg repository and is used within the Global Styles panel. Import it as follows:

```js
import BackgroundImageControls from '../background-image-control';
```

## Props

| Prop               | Type     | Description |
|-------------------|---------|-------------|
| `onChange`       | function | Callback function triggered when background properties change. |
| `style`          | object   | Object containing the background styles. |
| `inheritedValue` | object   | Inherited background styles, used as fallback values. |
| `defaultValues`  | object   | Default values for the background properties. |
| `onRemoveImage`  | function | Callback when the background image is removed. |
| `onResetImage`   | function | Callback when the background image is reset. |
| `displayInPanel` | boolean  | Determines if the control should be displayed in a panel layout. |

## Usage

```jsx
<BackgroundImageControls
    onChange={handleBackgroundChange}
    style={backgroundStyle}
    inheritedValue={inheritedBackground}
    defaultValues={defaultBackgroundValues}
    onRemoveImage={handleRemoveImage}
    onResetImage={handleResetImage}
    displayInPanel={true}
/>
```

## Utility Functions

### `coordsToBackgroundPosition(value)`
Converts FocalPointPicker x/y values to CSS `background-position` values.

```js
const position = coordsToBackgroundPosition({ x: 0.5, y: 0.5 });
// Output: '50% 50%'
```

### `backgroundPositionToCoords(value)`
Converts a CSS `background-position` value to FocalPointPicker coordinates.

```js
const coords = backgroundPositionToCoords('50% 50%');
// Output: { x: 0.5, y: 0.5 }
```

## Accessibility
- Uses `aria-label` attributes for improved screen reader support.
- Implements `VisuallyHidden` for non-visual text descriptions.
- Ensures tab order for keyboard navigation.

## Related Components
- `MediaReplaceFlow` - Handles media uploads and replacements.
- `FocalPointPicker` - Allows precise background positioning.
