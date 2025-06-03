/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

const transforms = {
	to: [
		{
			type: 'block',
			blocks: [ 'core/post-comments-link' ],
			transform: ( attributes ) => {
				return createBlock( 'core/post-comments-link', {
					textAlign: attributes.textAlign,
				} );
			},
		},
	],
};

export default transforms;
