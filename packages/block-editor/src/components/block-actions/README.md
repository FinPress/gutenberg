## Block Actions

The `BlockActions` component provides an interface for executing various actions on a set of blocks in the WordPress block editor. These actions include duplication, removal, insertion, grouping, ungrouping, and style copying.

### Usage

```jsx
import BlockActions from './block-actions';

<BlockActions clientIds={selectedBlockIds}>
	{({ onDuplicate, onRemove }) => (
		<>
			<button onClick={onDuplicate}>Duplicate</button>
			<button onClick={onRemove}>Remove</button>
		</>
	)}
</BlockActions>;
```

### Props

| Prop                            | Type       | Description                                                          |
| ------------------------------- | ---------- | -------------------------------------------------------------------- |
| `clientIds`                     | `string[]` | Array of block client IDs to perform actions on.                     |
| `children`                      | `function` | A render prop function that receives available actions as an object. |
| `__experimentalUpdateSelection` | `function` | (Experimental) Function to update block selection after an action.   |

### Provided Actions

The `children` function receives an object with the following properties, which can be used to trigger block actions:

| Action           | Type                  | Description                                            |
| ---------------- | --------------------- | ------------------------------------------------------ |
| `onDuplicate`    | `() => void`          | Duplicates the selected blocks.                        |
| `onRemove`       | `() => void`          | Removes the selected blocks.                           |
| `onInsertBefore` | `() => void`          | Inserts a new block before the selected blocks.        |
| `onInsertAfter`  | `() => void`          | Inserts a new block after the selected blocks.         |
| `onGroup`        | `() => void`          | Groups the selected blocks into a container block.     |
| `onUngroup`      | `() => void`          | Ungroups a grouped block, extracting its inner blocks. |
| `onCopy`         | `() => void`          | Copies the selected block(s) for later pasting.        |
| `onPasteStyles`  | `() => Promise<void>` | Pastes styles from copied blocks.                      |

### Features

- **Duplication**: Allows duplicating blocks that support multiple instances.
- **Removal**: Provides an option to remove selected blocks.
- **Insertion**: Supports inserting new blocks before or after the selected ones.
- **Grouping & Ungrouping**: Enables conversion of selected blocks into a group and extraction of inner blocks from a group.
- **Copy & Paste Styles**: Copies styles from a block and applies them to another.

### Dependencies

The component uses the following WordPress dependencies:

- `@wordpress/data` for interacting with the editor's state.
- `@wordpress/blocks` for block support checks and transformations.
- `@wordpress/block-editor` for modifying blocks within the editor.

### Related Components

- `usePasteStyles` – Used to handle copying and pasting block styles.
- `block-editor/store` – The primary store for managing block actions.

### Notes

This component does not render UI directly. Instead, it provides action handlers through a render prop pattern, allowing flexibility in implementation.

---

For more details, refer to the [WordPress Gutenberg repository](https://github.com/WordPress/gutenberg).

