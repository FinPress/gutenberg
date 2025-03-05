# Resolution Tool

The Resolution Tool component is a component for selecting image resolution with preset options. It is used in the Image block's toolbar.

## Table of contents

1. [Development guidelines](#development-guidelines)
2. [Related components](#related-components)

## Development guidelines

### Usage

Render the `ResolutionTool` component.

```jsx
import { ResolutionTool } from '@wordpress/block-editor';

const MyResolutionTool = () => (
	<ResolutionTool
		panelId="image"
		value="full"
		onChange={ ( value ) => {
			// Handle the new alignment value
		} }
		options={ [
			{ value: 'full', label: 'Full' },
			{ value: 'large', label: 'Large' },
			{ value: 'medium', label: 'Medium' },
			{ value: 'thumbnail', label: 'Thumbnail' },
		] }
		defaultValue="full"
		isShownByDefault={ true }
		resetAllFilter={ resetAllFilter }
	/>
);
```

### Props

### `panelId`

**Type**: `string`
**Required**: Yes

Unique identifier for the panel.

### `value`

**Type**: `string`
**Required**: Yes

The current value of the resolution.

### `onChange`

**Type**: `Function`
**Required**: Yes

Function called when the resolution is changed.

### `options`

**Type**: `Array`
**Required**: Yes

Array of objects with the resolution options.

### `defaultValue`

**Type**: `string`
**Required**: Yes

The default value of the resolution.

### `isShownByDefault`

**Type**: `boolean`
**Required**: Yes

Whether the resolution tool is shown by default.

### `resetAllFilter`

**Type**: `Function`
**Required**: Yes

Function called when the resolution is reset.

## Related components

Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [BlockEditorProvider](https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/provider/README.md) in the components tree.
