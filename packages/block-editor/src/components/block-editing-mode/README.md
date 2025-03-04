# Block Editing Mode

The `block-editing-mode` component allows a block to restrict the user interface that is displayed for editing that block and its inner blocks.

## Usage

### Importing

```js
import { useBlockEditingMode } from '../block-editing-mode';
```

### Example

```js
function MyBlock( { attributes, setAttributes } ) {
    useBlockEditingMode( 'disabled' );
    return <div { ...useBlockProps() }></div>;
}
```

### Modes

The `mode` parameter can be set to one of the following values:

- `'disabled'`: Prevents editing the block entirely, i.e., it cannot be selected.
- `'contentOnly'`: Hides all non-content UI, such as auxiliary controls in the toolbar, block movers, and block settings.
- `'default'`: Allows editing the block as normal.

The mode is inherited by all of the block's inner blocks unless they have their own mode explicitly set.

If called outside of a block context, the mode is applied to all blocks.

## API

### `useBlockEditingMode( mode )`

#### Parameters

- `mode` (optional) - The editing mode to apply. If `undefined`, the current editing mode remains unchanged.

#### Returns

- The current `BlockEditingMode` for the block.

## Related

- `blockEditorStore`
- `useBlockEditContext`
- `blockEditingModeKey`

