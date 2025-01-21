/**
 * Internal dependencies
 */
import { BlockCanvas, BlockList } from '../..';

const meta = {
	title: 'BlockEditor/BlockCanvas',
	component: BlockCanvas,
	parameters: {
		docs: {
			canvas: { sourceState: 'shown' },
			description: {
				component:
					'The BlockCanvas component is used to render the canvas for the block editor.',
			},
		},
	},
	argTypes: {
		children: {
			control: false, // Disable direct control for `children` as it defaults to `BlockList`
			description: 'The children to render in the canvas.',
			table: {
				type: { summary: 'node' },
				defaultValue: { summary: 'BlockList' },
			},
		},
		height: {
			control: 'text',
			description: 'The height of the canvas.',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: '300px' },
			},
		},
		styles: {
			control: 'object',
			description: 'The styles to apply to the canvas.',
			table: {
				type: {
					summary:
						'{ css?: string; assets?: string; isGlobalStyles?: boolean; __unstableType: string; }[]',
				},
			},
		},
	},
};

export default meta;

export const Default = {
	args: {
		height: '100px',
		styles: [ { css: `body{font-size: 16px;}` } ],
		children: <BlockList />,
	},
	render: function Template( args ) {
		return <BlockCanvas { ...args } />;
	},
};
