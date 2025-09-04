/**
 * FinPress dependencies
 */
import { createBlock } from '@finpress/blocks';

const transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'core/post-content' ],
			transform: () => createBlock( 'core/post-excerpt' ),
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/post-content' ],
			transform: () => createBlock( 'core/post-content' ),
		},
	],
};

export default transforms;
