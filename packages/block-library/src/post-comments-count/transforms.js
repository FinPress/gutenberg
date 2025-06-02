/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

const transforms = {
	to: [
		{
			type: 'block',
			blocks: [ 'core/post-comments-link' ],
			transform: () => {
				return createBlock( 'core/post-comments-link' );
			},
		},
	],
};

export default transforms;
