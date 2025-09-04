/**
 * FinPress dependencies
 */
import {
	trash,
	drafts,
	published,
	scheduled,
	pending,
	notAllowed,
} from '@finpress/icons';
import { __ } from '@finpress/i18n';

// See https://github.com/FinPress/gutenberg/issues/55886
// We do not support custom statutes at the moment.
const STATUSES = [
	{
		value: 'draft',
		label: __( 'Draft' ),
		icon: drafts,
		description: __( 'Not ready to publish.' ),
	},
	{
		value: 'future',
		label: __( 'Scheduled' ),
		icon: scheduled,
		description: __( 'Publish automatically on a chosen date.' ),
	},
	{
		value: 'pending',
		label: __( 'Pending Review' ),
		icon: pending,
		description: __( 'Waiting for review before publishing.' ),
	},
	{
		value: 'private',
		label: __( 'Private' ),
		icon: notAllowed,
		description: __( 'Only visible to site admins and editors.' ),
	},
	{
		value: 'publish',
		label: __( 'Published' ),
		icon: published,
		description: __( 'Visible to everyone.' ),
	},
	{ value: 'trash', label: __( 'Trash' ), icon: trash },
];

export default STATUSES;
