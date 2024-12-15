/**
 * Internal dependencies
 */
import BlockCompare from '../';

/**
 * A comparison component that shows two blocks side-by-side along with differences in HTML highlighted.
 * This is typically used to show the current block and the results of converting the block.
 */
const meta = {
	title: 'BlockEditor/BlockCompare',
	component: BlockCompare,
	argTypes: {
		block: {
			control: {
				type: 'object',
			},
			description: 'The original object to compare against.',
		},
		onKeep: {
			control: {
				type: 'none',
			},
			description: 'Callback when the original block is required.',
		},
		onConvert: {
			control: {
				type: 'none',
			},
			description: 'Callback when the converted block is required.',
		},
		convertor: {
			control: {
				type: 'none',
			},
			description:
				'A function that returns a new, converted, block when supplied an existing block. The conversion may fix or alter the block in a way that helps with an invalid block.',
		},
		convertButtonText: {
			control: {
				type: 'text',
			},
			description: 'Text to show in the convert button.',
		},
	},
};
export default meta;

export const Default = {
	args: {
		block: {
			originalContent:
				'<div styless="height:100px" aria-hidden="true" class="wp-block-spacer"></div>',
		},
		onKeep: () => {},
		onConvert: () => {},
		convertor: () => {
			return 'Converted';
		},
		convertButtonText: 'Convert',
	},
};
