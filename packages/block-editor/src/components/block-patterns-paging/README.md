# Block Patterns Paging

A component that renders a paging control for navigating through block patterns.

## Table of contents

1. [Development guidelines](#development-guidelines)
2. [Related components](#related-components)

## Development guidelines

### Usage

Render a `BlockPatternsPaging` component to display a paging control for navigating through block patterns.

```jsx
import { BlockPatternsPaging } from '@wordpress/block-editor';

const MyBlockPatternsPaging = () => (
	<BlockPatternsPaging
		currentPage={ 1 }
		totalPages={ 3 }
		changePage={ ( newPage ) => {
			// Handle the new page value
		} }
		totalItems={ 10 }
	/>
);
```

### Props

### `currentPage`

-   **Type:** `number`
-   **Required:** Yes

The current page number.

### `totalPages`

-   **Type:** `number`
-   **Required:** Yes

The total number of pages.

### `changePage`

-   **Type:** `Function`
-   **Required:** Yes

A function that will be called when the page is changed. It receives the new page number as an argument.

### `totalItems`

-   **Type:** `number`
-   **Required:** Yes

The total number of items.

## Related components

Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a [BlockEditorProvider](https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/provider/README.md) in the components tree.
