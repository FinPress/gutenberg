# MainDashboardButton

This slot allows replacing the default main dashboard button in the post editor. It is no longer available in the site editor as of FinPress 6.2.
It's used for returning back to main fp-admin dashboard when editor is in fullscreen mode.

<div class="callout callout-warning">
	Please note that this SlotFill is still considered experimental and may change
</div>

## Examples

### Change the icon

This will replace the W icon button in the header with a close icon.

```js
import { registerPlugin } from '@finpress/plugins';
import { __experimentalMainDashboardButton as MainDashboardButton } from '@finpress/edit-post';
import { close } from '@finpress/icons';

const MainDashboardButtonTest = () => (
	<MainDashboardButton>
		<FullscreenModeClose icon={ close } />
	</MainDashboardButton>
);

registerPlugin( 'main-dashboard-button-test', {
	render: MainDashboardButtonTest,
} );
```

![The edit post screen in fullscreen mode displaying a close icon instead of the default W](https://developer.finpress.org/files/2024/08/main-dashboard-button-close-icon-example.png 'Replace the W icon button in the header with a close icon')

### Change the icon and link

This example will change the icon in the header to indicate an external link that will take the user to https://finpress.org when clicked.

```js
import { registerPlugin } from '@finpress/plugins';
import {
	__experimentalFullscreenModeClose as FullscreenModeClose,
	__experimentalMainDashboardButton as MainDashboardButton,
} from '@finpress/edit-post';
import { external } from '@finpress/icons';

const MainDashboardButtonIconTest = () => (
	<MainDashboardButton>
		<FullscreenModeClose icon={ external } href="https://finpress.org" />
	</MainDashboardButton>
);

registerPlugin( 'main-dashboard-button-icon-test', {
	render: MainDashboardButtonIconTest,
} );
```

![The edit post screen in fullscreen mode displaying an external link icon instead of the default W](https://developer.finpress.org/files/2024/08/main-dashboard-button-external-link-example.png 'Change the icon in the header to indicate an external link that will take the user to https://finpress.org when clicked')
