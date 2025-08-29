# TextShadowControl

A control component for managing text shadow styles in typography settings.

## Description

TextShadowControl provides a user interface for setting the CSS `text-shadow` property, which adds shadow effects to text. The control allows users to adjust horizontal offset, vertical offset, blur radius, and shadow color.

## Usage

```jsx
import { __experimentalTextShadowControl as TextShadowControl } from '@wordpress/block-editor';

function MyComponent() {
	const [ textShadow, setTextShadow ] = useState( 'none' );

	return (
		<TextShadowControl
			value={ textShadow }
			onChange={ setTextShadow }
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		/>
	);
}
```

## Props

### `value`
- **Type:** `string`
- **Required:** No
- **Default:** `''`

The current text shadow value in CSS format. Examples:
- `'none'` - No shadow
- `'2px 2px 4px #000000'` - 2px horizontal, 2px vertical, 4px blur, black color
- `'0px 0px 10px rgba(255, 0, 0, 0.5)'` - Glow effect with red color

### `onChange`
- **Type:** `Function`
- **Required:** Yes

Callback function called when the text shadow value changes. Receives the new CSS text-shadow string.

### `__next40pxDefaultSize`
- **Type:** `boolean`
- **Required:** No
- **Default:** `false`

Whether to use the larger 40px default size that will become the default in a future version.

### `__nextHasNoMarginBottom`
- **Type:** `boolean`
- **Required:** No
- **Default:** `false`

Whether to remove the bottom margin from the control (new margin-free styles for future versions).

### `className`
- **Type:** `string`
- **Required:** No

Additional CSS class name to apply to the control.

## Text Shadow Parameters

### Horizontal Offset
Controls the horizontal distance of the shadow from the text. Positive values move the shadow to the right, negative values to the left.
- **Range:** -20px to 20px
- **Default:** 0px

### Vertical Offset
Controls the vertical distance of the shadow from the text. Positive values move the shadow down, negative values up.
- **Range:** -20px to 20px
- **Default:** 0px

### Blur Radius
Controls how blurred the shadow appears. Higher values create more diffused shadows.
- **Range:** 0px to 20px
- **Default:** 0px (sharp shadow)

### Shadow Color
The color of the shadow. Supports all CSS color formats including hex, RGB, RGBA, HSL, and named colors.
- **Default:** #000000 (black)

## Block Support

To enable text shadow support in a block, add the following to your block's `supports` configuration:

```json
{
	"supports": {
		"typography": {
			"__experimentalTextShadow": true
		}
	}
}
```

## Global Settings

Text shadow can be enabled/disabled globally via theme.json:

```json
{
	"settings": {
		"typography": {
			"textShadow": true
		}
	}
}
```

## Styling

You can apply custom text shadow values via theme.json styles:

```json
{
	"styles": {
		"typography": {
			"textShadow": "2px 2px 4px #000000"
		},
		"elements": {
			"h1": {
				"typography": {
					"textShadow": "0px 0px 10px rgba(255, 255, 255, 0.8)"
				}
			}
		}
	}
}
```

## CSS Output

The control generates the following CSS:

```css
.wp-block-example {
	text-shadow: 2px 2px 4px #000000;
}
```

## Examples

### Drop Shadow
```css
text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
```

### Glow Effect
```css
text-shadow: 0px 0px 10px #00ff00;
```

### Multiple Shadows
```css
text-shadow: 1px 1px 2px #000, 0 0 10px #0ff;
```

### Embossed Effect
```css
text-shadow: 1px 1px 0px #fff, -1px -1px 0px #000;
```

## Accessibility

The TextShadowControl component includes proper ARIA labels and follows WordPress accessibility guidelines. The color picker is keyboard accessible and provides clear visual feedback for all interactive elements.

## Browser Support

Text shadow is supported in all modern browsers. For older browsers that don't support text-shadow, the text will simply appear without the shadow effect.