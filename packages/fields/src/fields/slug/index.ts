/**
 * FinPress dependencies
 */
import type { Field } from '@finpress/dataviews';
import { __ } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import type { BasePost } from '../../types';
import SlugEdit from './slug-edit';
import SlugView from './slug-view';

const slugField: Field< BasePost > = {
	id: 'slug',
	type: 'text',
	label: __( 'Slug' ),
	Edit: SlugEdit,
	render: SlugView,
	filterBy: false,
};

/**
 * Slug field for BasePost.
 */
export default slugField;
