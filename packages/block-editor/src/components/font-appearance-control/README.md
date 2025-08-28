# Font Appearance Control

The `FontAppearanceControl` component renders a dropdown menu that displays font style and weight options for the selected font family. This control dynamically adapts to show style/weight combinations supported by the active font.

This component is primarily used in typography-related block settings (e.g., Paragraph, Heading, etc.) where users need to adjust visual appearance of text elements. Available options vary based on the font's capabilities.

## Usage

Renders a font appearance selector with style/weight combinations.

```jsx
import { FontAppearanceControl } from '@wordpress/block-editor';

const MyFontAppearanceToolbar = () => {
	const [ fontAppearance, setFontAppearance ] = useState( {
		fontStyle: 'normal',
		fontWeight: '400',
	} );

	return (
		<FontAppearanceControl
			value={ fontAppearance }
			onChange={ ( newAppearance ) => {
				setFontAppearance( newAppearance );
			} }
			fontFamilyFaces={ availableFontFaces }
			hasFontStyles={ true }
			hasFontWeights={ true }
			__next40pxDefaultSize={ true }
		/>
	);
};
```

## Props

### `value`

- Type: `Object`
- Default: `{ fontStyle: undefined, fontWeight: undefined }`
- Required: No

An object with `fontStyle` and `fontWeight` properties.

### `onChange`

- Type: `Function`
- Required: Yes

Callback invoked when selection changes. Receives new appearance object containing `fontStyle` and `fontWeight` properties.

### `hasFontStyles`

- Type: `Boolean`
- Default: `true`
- Required: No

Determines whether font style options (e.g., italic) should be shown.

### `hasFontWeights`

- Type: `Boolean`
- Default: `true`
- Required: No

Determines whether font weight options (e.g., bold) should be shown.

### `fontFamilyFaces`

- Type: `Array<Object>`

Array of font face objects with `fontStyle` and `fontWeight` properties.

### `__next40pxDefaultSize`

- Type: `Boolean`
- Default: `false`
- Required: No

Start opting into the larger default height that will become the default size in a future version.

