# Observe Typing

`<ObserveTyping />` is a component used in managing the editor's internal typing flag. When used to wrap content, it observes keyboard and mouse events to set and unset the typing flag. The typing flag is used in considering whether the block border and controls should be visible. While typing, these elements are hidden for a distraction-free experience.

## Table of contents

1. [Development guidelines](#development-guidelines)
2. [Related components](#related-components)

## Development guidelines

## Usage

Wrap the component where blocks are to be rendered with `<ObserveTyping />`:

```jsx
function VisualEditor() {
	return (
		<ObserveTyping>
			<MyInput />
		</ObserveTyping>
	);
}
```

### Props

### `children`

-   Type: `ReactNode`
-   Required: Yes

The content to be wrapped by the component.

## Related components

Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [BlockEditorProvider](https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/provider/README.md) in the components tree.
