# Tool Selector

The `ToolSelector` component is a toolbar component that allows user to choose between simplified content tools (Write) and advanced visual editing tools (Design)/

## Table of contents

1. [Development guidelines](#development-guidelines)
2. [Related components](#related-components)

## Development guidelines

### Usage

Render the `ToolSelector` component within the `BlockEditorProvider` component.

```jsx
const MyCustomToolbar = () => {
	return (
		<NavigationToolbar>
			<ToolbarItem>
				<ToolbarItem as={ ToolSelector } />
			</ToolbarItem>
		</NavigationToolbar>
	);
};

export default MyCustomToolbar;
```

### Props

#### `props`

-   Type: `Object`

Props that can be passed to the `ToolSelector` component.

#### `ref`

-   Type: `React.RefObject<HTMLElement>`

A ref object that can be used to access the underlying HTML element.

## Related components

Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [BlockEditorProvider](https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/provider/README.md) in the components tree.
