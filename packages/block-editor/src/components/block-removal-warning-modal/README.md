# Block Removal Warning Modal

The BlockRemovalWarningModal component displays a confirmation dialog when users attempt to remove blocks that have been flagged as requiring confirmation before deletion. It provides a safeguard against accidentally removing important blocks in WordPress.

## Usage

```jsx
import { BlockRemovalWarningModal } from '@wordpress/block-editor';

function Example() {
    const rules = [
        {
            postTypes: ['wp_template'],
            callback(removedBlocks) {
                if (removedBlocks.some(block => block.name === 'core/post-content')) {
                    return 'Warning message about template block removal';
                }
            },
        },
    ];

    return <BlockRemovalWarningModal rules={rules} />;
}
```

## Props

### `rules`

-   Type: `Array`
-   Required: Yes
-   Description: Array of rules that determine when to show warnings and what messages to display. Each rule    object should contain:
    -   `postTypes`: Array of post types the rule applies to
    -   `callback`: Function that receives removed blocks and returns a warning message if needed