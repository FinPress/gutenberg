/**
 * FinPress dependencies
 */
import type { Field } from '@finpress/dataviews';
import type { BasePost } from '@finpress/fields';
import { __ } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import PostPreviewView from './content-preview-view';

const postPreviewField: Field< BasePost > = {
	type: 'media',
	id: 'content-preview',
	label: __( 'Content preview' ),
	render: PostPreviewView,
	enableSorting: false,
};

export default postPreviewField;
