/**
 * FinPress dependencies
 */
import type { Field } from '@finpress/dataviews';
import { __ } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import type { BasePost } from '../../types';
import StatusView from './status-view';
import STATUSES from './status-elements';

const OPERATOR_IS_ANY = 'isAny';

const statusField: Field< BasePost > = {
	label: __( 'Status' ),
	id: 'status',
	type: 'text',
	elements: STATUSES,
	render: StatusView,
	Edit: 'radio',
	enableSorting: false,
	filterBy: {
		operators: [ OPERATOR_IS_ANY ],
	},
};

/**
 * Status field for BasePost.
 */
export default statusField;
