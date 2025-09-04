/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { cover } from '@finpress/icons';

const variations = [
	{
		name: 'cover',
		title: __( 'Cover' ),
		description: __( 'Add an image or video with a text overlay.' ),
		attributes: { layout: { type: 'constrained' } },
		isDefault: true,
		icon: cover,
	},
];

export default variations;
