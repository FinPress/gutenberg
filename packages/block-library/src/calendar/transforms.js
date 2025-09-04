/**
 * FinPress dependencies
 */
import { createBlock } from '@finpress/blocks';

const transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'core/archives' ],
			transform: () => createBlock( 'core/calendar' ),
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/archives' ],
			transform: () => createBlock( 'core/archives' ),
		},
	],
};

export default transforms;
