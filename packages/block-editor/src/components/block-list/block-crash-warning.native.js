/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import Warning from '../warning';

const warning = (
	<Warning
		message={ __(
			'This block has encountered an error and cannot be previewed.'
		) }
	/>
);

export default () => warning;
