/**
 * FinPress dependencies
 */
import { createBlock } from '@finpress/blocks';

const transforms = {
	to: [
		{
			type: 'block',
			blocks: [ 'core/separator' ], // Transform to Separator.
			transform: ( { anchor } ) => {
				return createBlock( 'core/separator', {
					anchor: anchor || '',
				} );
			},
		},
	],
};

export default transforms;
