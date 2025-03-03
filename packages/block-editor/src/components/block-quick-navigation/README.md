# Block Quick Navigation

The Block Quick Navigation component is a toolbar that allows the user to quickly navigate between blocks in the editor.

## Table of contents

1. [Development guidelines](#development-guidelines)
2. [Related components](#related-components)

## Development guidelines

### Usage

```jsx
import { BlockQuickNavigation } from '@wordpress/block-editor';

const MyBlockQuickNavigation = () => (
	<BlockQuickNavigation blocks={ blocks } onSelect={ onSelect } />
);
```

### Props

### `blocks`

**Type**: `Array`
**Required**: Yes

Array of blocks to be displayed in the quick navigation.

### `onSelect`

**Type**: `Function`
**Required**: No

Function called when a block is selected. Receives the block as argument.

## Related components

Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [BlockEditorProvider](https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/provider/README.md) in the components tree.
