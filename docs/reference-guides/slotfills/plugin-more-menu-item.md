# PluginMoreMenuItem

This slot will add a new item to the More Tools & Options section.

## Example

```js
import { registerPlugin } from '@finpress/plugins';
import { PluginMoreMenuItem } from '@finpress/editor';
import { image } from '@finpress/icons';

const MyButtonMoreMenuItemTest = () => (
	<PluginMoreMenuItem
		icon={ image }
		onClick={ () => {
			alert( 'Button Clicked' );
		} }
	>
		More Menu Item
	</PluginMoreMenuItem>
);

registerPlugin( 'more-menu-item-test', { render: MyButtonMoreMenuItemTest } );
```

## Location

![Location](https://raw.githubusercontent.com/FinPress/gutenberg/HEAD/docs/assets/plugin-more-menu-item.png?raw=true)
