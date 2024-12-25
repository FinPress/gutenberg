# FontAppearanceControl

Control to display font style and weight options for a selected font family.

This component allows users to select a combination of font style and font weight from the available options provided by the `fontFamilyFaces` prop. It supports enabling or disabling styles and weights individually.

## Usage

```jsx
import { useState } from '@wordpress/element';
import { FontAppearanceControl } from '@wordpress/block-editor';

function Example() {
    const [fontAppearance, setFontAppearance] = useState({ fontStyle: 'normal', fontWeight: '400' });

    return (
        <FontAppearanceControl
			__next40pxDefaultSize
            fontFamilyFaces={[
                { fontFamily: 'roboto', fontStyle: 'normal', fontWeight: '400' },
                { fontFamily: 'roboto', fontStyle: 'italic', fontWeight: '700' },
            ]}
            value={fontAppearance}
            onChange={(newAppearance) => setFontAppearance(newAppearance)}
            hasFontStyles={true}
            hasFontWeights={true}
        />
    );
}
```

## Props

### `__next40pxDefaultSize`

-   **Type:** `boolean`
-   **Default:** `false`

Enable the next 40px default size for the control.

### `onChange`

-   **Type:** `Function`

Callback invoked when a new font style or weight is selected. The callback receives the new selection as an object with `fontStyle` and `fontWeight` properties.

### `hasFontStyles`

-   **Type:** `boolean`
-   **Default:** `true`

Whether font styles (e.g., `normal`, `italic`) are available for selection.

### `hasFontWeights`

-   **Type:** `boolean`
-   **Default:** `true`

Whether font weights (e.g., `400`, `700`) are available for selection.

### `fontFamilyFaces`

-   **Type:** `Array`

List of font faces containing style and weight options. Each object in the array should have the following properties:

- `fontFamily`: The font family name.
- `fontStyle`: The font style (e.g., `normal`, `italic`).
- `fontWeight`: The font weight (e.g., `400`, `700`).

### `value`

-   **Type:** `Object`

The current font appearance selection.

- `fontStyle`: The selected font style.
- `fontWeight`: The selected font weight.

### `otherProps`

-   **Type:** `Object`

Additional props passed to the underlying `CustomSelectControl` component.
