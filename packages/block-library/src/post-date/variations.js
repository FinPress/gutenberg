/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { postDate } from '@finpress/icons';

const variations = [
	{
		name: 'post-date',
		title: __( 'Post Date' ),
		description: __( "Display a post's publish date." ),
		attributes: {
			metadata: {
				bindings: {
					datetime: {
						source: 'core/post-data',
						args: { key: 'date' },
					},
				},
			},
		},
		scope: [ 'block', 'inserter', 'transform' ],
		isActive: ( blockAttributes ) =>
			blockAttributes?.metadata?.bindings?.datetime?.source ===
				'core/post-data' &&
			blockAttributes?.metadata?.bindings?.datetime?.args?.key === 'date',
		icon: postDate,
	},
	{
		name: 'post-date-modified',
		title: __( 'Modified Date' ),
		description: __( "Display a post's last updated date." ),
		attributes: {
			metadata: {
				bindings: {
					datetime: {
						source: 'core/post-data',
						args: { key: 'modified' },
					},
				},
			},
			className: 'fp-block-post-date__modified-date',
		},
		scope: [ 'block', 'inserter', 'transform' ],
		isActive: ( blockAttributes ) =>
			blockAttributes?.metadata?.bindings?.datetime?.source ===
				'core/post-data' &&
			blockAttributes?.metadata?.bindings?.datetime?.args?.key ===
				'modified',
		icon: postDate,
	},
];

export default variations;
