/**
 * WordPress dependencies
 */
import type { Field } from '@wordpress/dataviews';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { BasePost } from '../../types';
import { ParentEdit } from './parent-edit';
import { ParentView } from './parent-view';

const parentField: Field< BasePost > = {
	id: 'parent',
	type: 'integer',
	label: __( 'Parent' ),
	Edit: ParentEdit,
	render: ParentView,
	enableSorting: true,
	elements: [],
	filterBy: {
		operators: [ 'is', 'isNot' ],
	},
	getValue: ( { item } ) => {
		return item.parent || 0;
	},
};

/**
 * Parent field for BasePost.
 */
export default parentField;
