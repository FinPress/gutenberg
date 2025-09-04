/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { Notice, __experimentalSpacer as Spacer } from '@finpress/components';

export default function SidebarNavigationScreenUnsupported() {
	return (
		<Spacer padding={ 3 }>
			<Notice status="warning" isDismissible={ false }>
				{ __(
					'The theme you are currently using does not support this screen.'
				) }
			</Notice>
		</Spacer>
	);
}
