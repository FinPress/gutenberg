# Block Switcher

The `BlockSwitcher` component provides a toolbar dropdown menu for converting between block types, applying block styles, and accessing pattern transformations. It appears in the block toolbar when these transformation options are available.

## Usage

Render component to enable block transformations.

```jsx
import { BlockSwitcher } from '@wordpress/block-editor';

function MyBlockSwitcher() {
	return (
		<BlockSwitcher clientIds={['ch1d82m9-d33a-4c12-b5d9-a8927e12b654']} />
	);
}
```

## Props

### clientIds

The client IDs of the blocks that will be displayed in the block list.

-   Type: `Array<String>`
-   Required: Yes
