# Badge

`Badge` is a `reusable component` to display important information in (not limited to) `data-views`.

## Usage

```jsx
import { Badge } from '@wordpress/components';

const ExampleBadge = () => {
	return (
		<Badge className="my-badge" as="span">
			Code is Poetry
		</Badge>
	);
};
```

## Props

### `className`: `string`

Additional classes for the badge component.

-   Required: No

### `as`: `ElementType`

Component type that will be used to render the badge component.

-   Required: No
-   Default: `div`

### `children`: `ReactNode`

The content to be displayed within the `Badge`.

-   Required: Yes
