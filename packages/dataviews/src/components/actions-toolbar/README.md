# ActionsToolbar Component

A standalone toolbar component that renders a row of action buttons, allowing you to reuse DataViews actions outside of the DataViews component itself.

## Usage

```tsx
import { ActionsToolbar } from '@wordpress/dataviews';
import { duplicatePost, trashPost, viewPost } from '@wordpress/fields';

// Your custom actions or existing DataViews actions
const actions = [
	viewPost,
	duplicatePost,
	trashPost,
];

// Item to perform actions on
const selectedPost = { id: 1, title: 'Hello World', status: 'published' };

function MyComponent() {
	return (
		<div>
			<h2>Post Actions</h2>
			<ActionsToolbar
				actions={ actions }
				item={ selectedPost }
				className="my-custom-toolbar"
			/>

			{/* Or with text labels instead of icons */}
			<ActionsToolbar
				actions={ actions }
				item={ selectedPost }
				showLabels={ true }
			/>
		</div>
	);
}
```

## Props

- `actions` (Action[]): Array of actions to render as buttons
- `item` (Item): Item the actions will operate on
- `className` (string, optional): Additional CSS class name
- `showLabels` (boolean, optional): Whether to show text labels instead of icons (default: false)

## Features

- **Eligibility Filtering**: Only shows actions for which the item is eligible
- **Modal Support**: Handles both callback and modal-based actions
- **Accessible**: Uses proper ARIA labels and disabled states

## Integration with Existing Actions

Works seamlessly with existing DataViews actions from `@wordpress/fields`:

```tsx
import {
	viewPost,
	duplicatePost,
	renamePost,
	trashPost,
	restorePost
} from '@wordpress/fields';

const postActions = [
	viewPost,
	duplicatePost,
	renamePost,
	trashPost,
	restorePost,
];
```

## Custom Actions

You can also create custom actions following the DataViews Action interface:

```tsx
const customAction = {
	id: 'my-custom-action',
	label: 'Custom Action',
	icon: myIcon,
	callback: ( items, { registry } ) => {
		// Your custom logic here
		console.log( 'Processing item:', items[0] );
	},
	isEligible: ( item ) => item.status === 'published',
};
```
