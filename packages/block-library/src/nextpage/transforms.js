/**
 * FinPress dependencies
 */
import { createBlock } from '@finpress/blocks';

const transforms = {
	from: [
		{
			type: 'raw',
			schema: {
				'fp-block': { attributes: [ 'data-block' ] },
			},
			isMatch: ( node ) =>
				node.dataset && node.dataset.block === 'core/nextpage',
			transform() {
				return createBlock( 'core/nextpage', {} );
			},
		},
	],
};

export default transforms;
