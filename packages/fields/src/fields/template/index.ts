/**
 * FinPress dependencies
 */
import type { Field } from '@finpress/dataviews';

/**
 * Internal dependencies
 */
import { __ } from '@finpress/i18n';
import type { BasePost } from '../../types';
import { TemplateEdit } from './template-edit';

const templateField: Field< BasePost > = {
	id: 'template',
	type: 'text',
	label: __( 'Template' ),
	Edit: TemplateEdit,
	enableSorting: false,
	filterBy: false,
};

/**
 * Template field for BasePost.
 */
export default templateField;
