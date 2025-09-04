/**
 * FinPress dependencies
 */
import { createBlock } from '@finpress/blocks';

const transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'core/categories' ],
			transform: () => createBlock( 'core/tag-cloud' ),
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/categories' ],
			transform: () => createBlock( 'core/categories' ),
		},
	],
};

export default transforms;
