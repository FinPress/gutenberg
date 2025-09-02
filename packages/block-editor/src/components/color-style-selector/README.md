# ColorStyleSelector

The ColorStyleSelector component provides a dropdown interface for selecting text and background colors in the block editor. It renders as a toolbar button that, when clicked, reveals a color selection interface for modifying block styles.

## Usage

```jsx
import { BlockColorsStyleSelector } from '@wordpress/block-editor';
import { ColorPalette } from '@wordpress/components';

const MyColorSelectorComponent = () => (
    <BlockColorsStyleSelector
        TextColor={TextColorComponent}
        BackgroundColor={BackgroundColorComponent}
    >
        <ColorPalette
            colors={colors}
            onChange={(color) => setAttributes({ textColor: color })}
        />
    </BlockColorsStyleSelector>
);
```

## Props

### TextColor

Text color component that wraps icon.

- Type: `Element`
- Required: Yes

### BackgroundColor

Background color component that wraps icon.

- Type: `Element`
- Required: Yes

### children

The content to be displayed within the dropdown panel when the color selector button is clicked.

- Type: `Element`
- Required: No

### className

Class name for component.

- Type: `string`
- Required: No