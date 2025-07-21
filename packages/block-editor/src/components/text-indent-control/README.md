# TextIndentControl

A typography control component for the Gutenberg block editor that allows users to set text indentation for blocks.

### Usage

```js
import { TextIndentControl } from '@wordpress/block-editor';

function Edit( { attributes, setAttributes, clientId, name } ) {
	return (
		<TextIndentControl
			clientId={ clientId }
			attributes={ attributes }
			setAttributes={ setAttributes }
			name={ name }
		/>
	);
}
```

### Props

#### clientId

-   Type: String
-   Required: Yes
-   Description: The block's client ID.

#### attributes

-   Type: Object
-   Required: Yes
-   Description: Block attributes containing the textIndent value.

#### setAttributes

-   Type: Function
-   Required: Yes
-   Description: Function to update block attributes.

#### name

-   Type: String
-   Required: Yes
-   Description: Block name for checking block support.

#### units

-   Type: Array
-   Required: No
-   Default: [{ value: 'px', label: 'px' }, { value: 'em', label: 'em' }, { value: 'rem', label: 'rem' }, { value: '%', label: '%' }]
    Description: Available units for the control.

#### min

-   Type: Number
-   Required: No
-   Default: -200
-   Description: Minimum value for the control.

#### max

-   Type: Number
-   Required: No
-   Default: 200
-   Description: Maximum value for the control.

#### step

-   Type: Number
-   Required: No
-   Default: 0.1
-   Description: Step increment for the control.

#### help

-   Type: String
-   Required: No
-   Default: 'Set the indentation of the first line of text.'
-   Description: Help text displayed below the control.

#### label

-   Type: String
-   Required: No
-   Default: 'Text indent'
-   Description: Label for the control.
