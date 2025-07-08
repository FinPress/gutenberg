/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { postDate } from '@wordpress/icons';

const variations = [
	{
		name: 'post-date-modified',
		title: __( 'Modified Date' ),
		description: __( "Display a post's last updated date." ),
		attributes: {
			metadata: {
				bindings: {
					date: {
						source: 'core/post-data',
						args: { key: 'modified' },
					},
				},
			},
		},
		scope: [ 'block', 'inserter' ],
		isActive: ( blockAttributes ) =>
			blockAttributes?.metadata?.bindings?.date?.source ===
				'core/post-data' &&
			blockAttributes?.metadata?.bindings?.date?.args?.key === 'modified',
		icon: postDate,
	},
];

export default variations;
