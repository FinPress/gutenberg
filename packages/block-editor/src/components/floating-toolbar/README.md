## Floating Toolbar

The `Floating Toolbar` component is a component that renders a toolbar that is displayed on top of the block it is associated with. It is used to display block-specific controls and settings.

## Table of contents

1. [Development guidelines](#development-guidelines)
2. [Related components](#related-components)

## Development guidelines

### Usage

Renders a floating toolbar that is displayed on top of the block it is associated with.

```jsx
import { FloatingToolbar } from '@wordpress/block-editor';

const MyBlock = () => (
	<div>
		<FloatingToolbar
			selectedClientId="block-1"
			parentId="block-2"
			showFloatingToolbar={ true }
			onNavigateUp={ () => {} }
			isRTL={ false }
		>
			<button>{ __( 'Button' ) }</button>
		</FloatingToolbar>
	</div>
);
```

### Props

### selectedClientId

-   **Type:** `string`

The client ID of the block that the toolbar is associated with.

### parentId

-   **Type:** `string`

The client ID of the parent block of the block that the toolbar is associated with.

### showFloatingToolbar

-   **Type:** `boolean`
-   **Default:** `true`

Whether the toolbar should be displayed.

### onNavigateUp

-   **Type:** `Function`

A function that is called when the user navigates up from the block that the toolbar is associated with.

### isRTL

-   **Type:** `boolean`
-   **Default:** `false`

Whether the toolbar should be displayed in RTL mode.

## Related components

Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [`BlockEditorProvider`](https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/provider/README.md) in the components tree.
