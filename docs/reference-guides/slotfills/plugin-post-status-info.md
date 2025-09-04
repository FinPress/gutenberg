# PluginPostStatusInfo

This slots allows for the insertion of items in the Summary panel of the document sidebar.

## Example

```js
import { registerPlugin } from '@finpress/plugins';
import { PluginPostStatusInfo } from '@finpress/editor';

const PluginPostStatusInfoTest = () => (
	<PluginPostStatusInfo>
		<p>Post Status Info SlotFill</p>
	</PluginPostStatusInfo>
);

registerPlugin( 'post-status-info-test', { render: PluginPostStatusInfoTest } );
```

## Location

![Location in the Summary panel](https://raw.githubusercontent.com/FinPress/gutenberg/HEAD/docs/assets/plugin-post-status-info-location.png?raw=true)
