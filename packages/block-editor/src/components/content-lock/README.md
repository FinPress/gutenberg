# Content Lock

The `ContentLock` component is a component that can be used to lock the content of a block. It is used to prevent the user from interacting with the block's content, and is typically used when the block is in a read-only state.

## Table of contents

1. [Development guidelines](#development-guidelines)
2. [Related components](#related-components)

## Development guidelines

### Usage

```jsx
import { ModifyContentLockMenuItem } from '@wordpress/block-editor';

const MyBlock = () => {
	return (
		<ModifyContentLockMenuItem
			clientId={ clientId }
			onClose={ onClose }
		></ModifyContentLockMenuItem>
	);
};
```

### Props

### `clientId`

**Type**: `string`

### `onClose`

**Type**: `Function`

## Related components

Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [BlockEditorProvider](https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/provider/README.md) in the components tree.
