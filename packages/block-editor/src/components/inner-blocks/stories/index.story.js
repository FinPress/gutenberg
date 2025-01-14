/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	store as blockEditorStore,
	BlockEditorProvider,
} from '@wordpress/block-editor';
import { SlotFillProvider } from '@wordpress/components';
import { createRegistry, RegistryProvider } from '@wordpress/data';
import { store as blocksStore } from '@wordpress/blocks';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';
import { store as preferencesStore } from '@wordpress/preferences';
import { store as interfaceStore } from '@wordpress/interface';

/**
 * Internal dependencies
 */
import InnerBlocks, { useInnerBlocksProps } from '../';

const registry = createRegistry();

// Register all required stores
[
	blockEditorStore,
	blocksStore,
	keyboardShortcutsStore,
	interfaceStore,
	preferencesStore,
].forEach( ( store ) => registry.register( store ) );

registry.dispatch( blockEditorStore ).updateSettings( {
	hasFixedToolbar: true,
	focusMode: false,
	hasInlineToolbar: false,
} );

const meta = {
	title: 'BlockEditor/InnerBlocks',
	component: InnerBlocks,
	parameters: {
		docs: {
			description: {
				component:
					'InnerBlocks is a component which allows a single block to have multiple blocks as children.',
			},
			canvas: { sourceState: 'shown' },
		},
		layout: 'centered',
	},
	argTypes: {
		allowedBlocks: {
			control: 'object',
			description:
				'Array of allowed block types or true/false for all/none',
			table: {
				type: { summary: 'Array<String> | Boolean' },
				defaultValue: { summary: 'true' },
			},
		},
		template: {
			control: 'object',
			description: 'Template for initial blocks',
			table: {
				type: { summary: 'Array<Array>' },
			},
		},
		templateLock: {
			control: 'select',
			options: [ false, 'all', 'insert', 'contentOnly' ],
			description: 'Lock level for the template',
			table: {
				type: { summary: 'String | Boolean' },
			},
		},
		orientation: {
			control: 'select',
			options: [ 'horizontal', 'vertical', 'none' ],
			description: 'Orientation of inner blocks',
			table: {
				type: { summary: 'String' },
				defaultValue: { summary: 'vertical' },
			},
		},
		renderAppender: {
			control: 'select',
			options: [ 'default', 'button', 'none' ],
			description: 'Type of appender to render',
			mapping: {
				default: undefined,
				button: InnerBlocks.ButtonBlockAppender,
				none: false,
			},
		},
	},
	decorators: [
		( Story ) => (
			<RegistryProvider value={ registry }>
				<SlotFillProvider>
					<BlockEditorProvider
						value={ [] }
						settings={ {
							hasFixedToolbar: true,
							templateLock: false,
						} }
						onInput={ () => {} }
						onChange={ () => {} }
					>
						<div
							style={ {
								maxWidth: '720px',
								margin: '20px auto',
								minHeight: '150px',
							} }
						>
							<Story />
						</div>
					</BlockEditorProvider>
				</SlotFillProvider>
			</RegistryProvider>
		),
	],
};

export default meta;

const InnerBlocksWrapper = ( { ...props } ) => {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, props );
	return <div { ...innerBlocksProps } />;
};

export const Default = {
	args: {},
	render: ( args ) => <InnerBlocksWrapper { ...args } />,
};

export const WithAllowedBlocks = {
	args: {
		allowedBlocks: [ 'core/paragraph', 'core/image' ],
	},
	render: ( args ) => <InnerBlocksWrapper { ...args } />,
};

export const WithTemplate = {
	args: {
		template: [ [ 'core/paragraph', { placeholder: 'Add content...' } ] ],
	},
	render: ( args ) => <InnerBlocksWrapper { ...args } />,
};

export const WithTemplateLock = {
	args: {
		template: [
			[ 'core/paragraph', { placeholder: 'Locked content...' } ],
		],
		templateLock: 'all',
	},
	render: ( args ) => <InnerBlocksWrapper { ...args } />,
};

export const HorizontalOrientation = {
	args: {
		orientation: 'horizontal',
		allowedBlocks: [ 'core/paragraph', 'core/image' ],
	},
	render: ( args ) => <InnerBlocksWrapper { ...args } />,
};

export const WithButtonAppender = {
	args: {
		renderAppender: InnerBlocks.ButtonBlockAppender,
	},
	render: ( args ) => <InnerBlocksWrapper { ...args } />,
};
