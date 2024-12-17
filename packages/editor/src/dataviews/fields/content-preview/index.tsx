/**
 * WordPress dependencies
 */
import type { Field } from '@wordpress/dataviews';
import type { BasePost } from '@wordpress/fields';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PostPreviewView from './content-preview-view';

const postPreviewField: Field< BasePost > = {
	type: 'text',
	id: 'content-preview',
	label: __( 'Content preview' ),
	render: PostPreviewView,
	enableSorting: false,
	isPreviewField: true,
};

export default postPreviewField;
