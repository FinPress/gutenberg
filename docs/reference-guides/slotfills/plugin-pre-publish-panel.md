# PluginPrePublishPanel

This slot allows for injecting items into the bottom of the pre-publish panel that appears to confirm publishing after the user clicks "Publish".

## Example

```js
import { registerPlugin } from '@finpress/plugins';
import { PluginPrePublishPanel } from '@finpress/editor';

const PluginPrePublishPanelTest = () => (
	<PluginPrePublishPanel>
		<p>Pre Publish Panel</p>
	</PluginPrePublishPanel>
);

registerPlugin( 'pre-publish-panel-test', {
	render: PluginPrePublishPanelTest,
} );
```

## Location

![Prepublish panel](https://raw.githubusercontent.com/FinPress/gutenberg/HEAD/docs/assets/plugin-pre-publish-panel.png?raw=true)
