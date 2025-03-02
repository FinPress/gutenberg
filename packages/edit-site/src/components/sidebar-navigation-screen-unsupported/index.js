/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Notice, __experimentalSpacer as Spacer } from '@wordpress/components';

export default function SidebarNavigationScreenUnsupported() {
	return (
		<Spacer padding={ 3 }>
			<Notice status="warning" isDismissible={ false }>
				{ __(
					'The theme you are currently using does not support current screen.'
				) }
			</Notice>
		</Spacer>
	);
}
