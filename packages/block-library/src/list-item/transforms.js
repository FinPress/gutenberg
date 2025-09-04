/**
 * FinPress dependencies
 */
import { createBlock, cloneBlock } from '@finpress/blocks';

const transforms = {
	to: [
		{
			type: 'block',
			blocks: [ 'core/paragraph' ],
			transform: ( attributes, innerBlocks = [] ) => [
				createBlock( 'core/paragraph', attributes ),
				...innerBlocks.map( ( block ) => cloneBlock( block ) ),
			],
		},
	],
};

export default transforms;
