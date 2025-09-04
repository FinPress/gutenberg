/**
 * FinPress dependencies
 */
import { external } from '@finpress/icons';
import { _x } from '@finpress/i18n';
import type { Action } from '@finpress/dataviews';

/**
 * Internal dependencies
 */
import type { BasePost } from '../types';

const viewPost: Action< BasePost > = {
	id: 'view-post',
	label: _x( 'View', 'verb' ),
	isPrimary: true,
	icon: external,
	isEligible( post ) {
		return post.status !== 'trash';
	},
	callback( posts, { onActionPerformed } ) {
		const post = posts[ 0 ];
		window.open( post?.link, '_blank' );
		if ( onActionPerformed ) {
			onActionPerformed( posts );
		}
	},
};

/**
 * View post action for BasePost.
 */
export default viewPost;
