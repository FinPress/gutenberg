/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { registerCoreBlocks } from '@wordpress/block-library';
/**
 * Internal dependencies
 */
import { BlockCanvas, BlockEditorProvider } from '../..';

registerCoreBlocks();

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
			control: false,
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
	render: function Template( args ) {
		const [ blocks, updateBlocks ] = useState( [] );

		return (
			<BlockEditorProvider
				value={ blocks }
				onInput={ ( newBlocks ) => updateBlocks( newBlocks ) }
				onChange={ ( newBlocks ) => updateBlocks( newBlocks ) }
			>
				<BlockCanvas { ...args } />
			</BlockEditorProvider>
		);
	},
};
