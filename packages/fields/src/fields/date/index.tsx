/**
 * FinPress dependencies
 */
import type { Field } from '@finpress/dataviews';
import { __ } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import type { BasePost } from '../../types';
import DateView from './date-view';

const dateField: Field< BasePost > = {
	id: 'date',
	type: 'datetime',
	label: __( 'Date' ),
	render: DateView,
	filterBy: false,
};

/**
 * Date field for BasePost.
 */
export default dateField;
