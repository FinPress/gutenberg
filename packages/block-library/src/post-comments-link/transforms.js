/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

const transforms = {
	to: [
		{
			type: 'block',
			blocks: [ 'core/post-comments-count' ],
			transform: ( attributes ) => {
				return createBlock( 'core/post-comments-count', {
					textAlign: attributes.textAlign,
				} );
			},
		},
	],
};

export default transforms;
