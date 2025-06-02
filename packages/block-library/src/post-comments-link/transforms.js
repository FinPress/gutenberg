/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

const transforms = {
	to: [
		{
			type: 'block',
			blocks: [ 'core/post-comments-count' ],
			transform: () => {
				return createBlock( 'core/post-comments-count' );
			},
		},
	],
};

export default transforms;
