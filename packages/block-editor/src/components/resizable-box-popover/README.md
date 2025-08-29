# ResizableBoxPopover

The `ResizableBoxPopover` component wraps a `ResizableBox` with a popover, utilizing the `BlockPopoverCover` component. It is designed for use in WordPress block editor environments where resizing functionality is required alongside contextual popover display.

## Usage

```jsx
import ResizableBoxPopover from './ResizableBoxPopover';

const resizableBoxProps = {
	minWidth: 200,
	maxWidth: 800,
	minHeight: 100,
	maxHeight: 400,
	className: 'custom-resizable-box',
};

const MyComponent = () => {
	return (
		<ResizableBoxPopover
			clientId="example-block-id"
			resizableBoxProps={resizableBoxProps}
			style={{ padding: '10px' }}
		/>
	);
};
```

## Props

### `clientId`

- **Type:** `string`
- **Required:** Yes

The unique identifier for the block associated with this popover. Used for managing block-specific popovers in the editor.

### `resizableBoxProps`

- **Type:** `Object`
- **Required:** Yes

Properties to configure the `ResizableBox` component. Supports all props available for the `ResizableBox`, such as `minWidth`, `maxWidth`, `minHeight`, `maxHeight`, and custom `className`.

### `props`

- **Type:** `Object`
- **Default:** `{}`

Additional props passed to the `BlockPopoverCover` component, allowing for further customization of the popover behavior and appearance.
