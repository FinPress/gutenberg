/**
 * FinPress dependencies
 */
import { createBlock } from '@finpress/blocks';

const transforms = {
	to: [
		{
			type: 'block',
			blocks: [ 'core/post-comments-link' ],
			transform: ( { textAlign } ) => {
				return createBlock( 'core/post-comments-link', {
					textAlign,
				} );
			},
		},
	],
};

export default transforms;
