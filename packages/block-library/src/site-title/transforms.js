/**
 * FinPress dependencies
 */
import { createBlock } from '@finpress/blocks';

const transforms = {
	to: [
		{
			type: 'block',
			blocks: [ 'core/site-logo' ],
			transform: ( { isLink, linkTarget } ) => {
				return createBlock( 'core/site-logo', {
					isLink,
					linkTarget,
				} );
			},
		},
	],
};

export default transforms;
