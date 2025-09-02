# Image Editor

The Image Editor component is a component that allows the user to edit an image. It provides a set of tools to crop, rotate, flip, and resize the image.

## Table of contents

1. [Development guidelines](#development-guidelines)
2. [Related components](#related-components)

## Development guidelines

### Usage

Renders an image editor component.

```jsx
import { ImageEditor } from '@wordpress/block-editor';

const MyImageEditor = () => (
	<ImageEditor
		id="image-editor"
		url="https://example.com/image.jpg"
		width={ 300 }
		height={ 200 }
		naturalHeight={ 300 }
		naturalWidth={ 200 }
		onSaveImage={ ( blob ) => {
			// Handle the edited image.
		} }
		onFinishEditing={ () => {
			// Handle the end of the editing.
		} }
		borderProps={ {
			borderRadius: 10,
			borderWidth: 2,
			borderColor: 'red',
		} }
	/>
);
```

### Props

#### id

-   Type: `string`
-   Required: Yes

The id of the image editor.

#### url

-   Type: `string`
-   Required: Yes

The URL of the image to edit.

#### width

-   Type: `number`
-   Required: Yes

The width of the image.

#### height

-   Type: `number`
-   Required: Yes

The height of the image.

#### naturalHeight

-   Type: `number`
-   Required: Yes

The natural height of the image.

#### naturalWidth

-   Type: `number`
-   Required: Yes

The natural width of the image.

#### onSaveImage

-   Type: `Function`
-   Required: Yes

A function that receives the edited image as a blob.

#### onFinishEditing

-   Type: `Function`
-   Required: Yes

A function that is called when the editing is finished.

#### borderProps

-   Type: `Object`
-   Required: No

An object with the border properties of the image.

## Related components

Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [BlockEditorProvider](https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/provider/README.md) in the components tree.
