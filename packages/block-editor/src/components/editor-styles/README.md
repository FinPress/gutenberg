## EditorStyles

The `EditorStyles` component dynamically applies CSS styles and SVG assets to the block editor, transforming theme styles for proper scoping and handling dark/light theme detection. This component ensures that editor styles match the frontend appearance while maintaining isolation from the admin interface.

The component automatically detects the background color of the editor canvas and applies appropriate dark or light theme classes to the document body, enabling theme-aware styling throughout the editor interface.

## Development guidelines

### Usage

The EditorStyles component is typically used internally by the BlockEditorProvider but can be used directly when you need custom style handling:

```jsx
import { EditorStyles } from '@wordpress/block-editor';

const MyCustomEditor = () => {
	const styles = [
		{
			id: 'theme-styles',
			css: '.editor-styles-wrapper { font-family: Georgia; }',
		},
		{
			id: 'custom-colors',
			css: '.has-primary-color { color: #0073aa; }',
		},
	];

	return (
		<div className="my-editor">
			<EditorStyles styles={ styles } scope=".my-editor" />
			{ /* Your editor content */ }
		</div>
	);
};
```

The component processes and applies styles while handling scope isolation and theme detection automatically.

### How it works

The EditorStyles component performs several key functions:

-   **Style Processing:** Transforms CSS styles using the internal `transformStyles` utility
-   **Scope Isolation:** Applies CSS scoping to prevent editor styles from affecting the admin interface
-   **Theme Detection:** Analyzes background colors to determine if a dark or light theme should be applied
-   **SVG Asset Handling:** Processes and injects SVG symbols for use in the editor
-   **Style Overrides:** Merges any registered style overrides from the block editor store

### Props

### `styles`

-   **Type:** `Array<Object>`
-   **Default:** `[]`

An array of style objects to be processed and applied. Each style object should contain:

-   `css`: CSS content to be applied
-   `__unstableType`: Optional type indicator (e.g., 'svgs' for SVG assets)

### `scope`

-   **Type:** `String`
-   **Default:** `undefined`

CSS selector used to scope the styles. When provided, all styles will be scoped to this selector to prevent conflicts with admin styles.

### `transformOptions`

-   **Type:** `Object`
-   **Default:** `undefined`

Options passed to the internal style transformation utility for advanced processing control.

### Theme Detection

The component includes sophisticated dark/light theme detection:

#### Detection Logic:

-   Analyzes the computed background color of the editor canvas
-   Uses the `colord` library with accessibility plugins for accurate color analysis
-   Considers transparent backgrounds as light theme
-   Applies `is-dark-theme` class to document body when background luminance is below 0.5

#### Canvas Selection:

-   Uses provided scope selector to find the canvas element
-   Falls back to document body if no scope is provided
-   Creates temporary wrapper element if canvas doesn't exist in DOM

### SVG Asset Management

The component handles SVG assets through:

-   **Symbol Injection:** Creates a hidden SVG element containing all symbol definitions
-   **Asset Filtering:** Processes styles marked with `__unstableType: 'svgs'`
-   **DOM Optimization:** Uses `dangerouslySetInnerHTML` for efficient SVG injection
-   **Accessibility:** Applies proper ARIA attributes and positioning for screen readers

### Performance Considerations

-   **Memoization:** Uses useMemo to prevent unnecessary style reprocessing
-   **Callback Optimization:** Employs useCallback for theme detection function
-   **Component Memoization:** Wrapped with memo() to prevent unnecessary re-renders
-   **Efficient DOM Updates:** Minimizes DOM manipulation through targeted updates

### Style Override Integration

The component integrates with the block editor's style override system:

```jsx
// Styles can be overridden programmatically
const overrides = new Map( [
	[ 'theme-styles', { css: '.custom { color: red; }' } ],
] );
```

Overrides are automatically merged with base styles, allowing for dynamic style customization.

### Browser Compatibility

-   Uses modern CSS custom properties where supported
-   Falls back gracefully for color computation
-   Handles different document contexts (iframe, standalone)
-   Compatible with all modern browsers supporting ES6+

### Related components

Block Editor components are components that can be used to compose the UI of your block editor. Thus, they can only be used under a `BlockEditorProvider` in the components tree.

### Technical Dependencies

The component relies on several external libraries:

-   **colord:** Advanced color manipulation and analysis
-   **colord/plugins/names:** Named color support
-   **colord/plugins/a11y:** Accessibility-focused color operations

These dependencies enable accurate theme detection and color analysis for optimal editor styling.
