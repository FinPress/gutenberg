_Note: An option to pass also an array of editor scripts exists since WordPress `6.1.0`._

### Script Loading Context in Iframed Editors

The `editorScript` loads in the admin window context, whereas scripts loaded by the block within the editor execute inside an iframe context. This affects script execution environments, particularly for libraries relying on global references or window properties.

#### Key details:

- **editorScript:** Loads in the admin (parent) window.
- **Block scripts:** Execute inside the iframe context.
- **Best practices:** Use `useRefEffect` with `defaultView` to target the iframe's window when libraries need window references.

#### Example usage of `useRefEffect` with `defaultView`:

```javascript
import { useRefEffect } from '@wordpress/compose';

function MyComponent() {
	const ref = useRefEffect( ( node ) => {
		const iframeWindow = node.ownerDocument.defaultView;
		// Initialize library with iframeWindow as context
	}, [] );

	return <div ref={ref}>My block content</div>;
}
```

#### Important warnings:

- Do not assume scripts loaded with `editorScript` have access to the iframe window context.
- Libraries that use window or document globals need adjustments or targeted context awareness due to iframe encapsulation.

#### API improvement suggestion:

It is recommended to enhance the block metadata API to better distinguish scripts loaded in the parent admin window versus those running in the iframe, allowing clearer intent and context-specific loading behavior.

