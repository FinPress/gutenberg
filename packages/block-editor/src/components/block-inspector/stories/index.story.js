/**
 * WordPress dependencies
 */
import { registerCoreBlocks } from '@wordpress/block-library';
import { createBlock } from '@wordpress/blocks';
import { useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { ExperimentalBlockEditorProvider } from '../../provider';
import BlockInspector from '../';

registerCoreBlocks();

const blocks = [ createBlock( 'core/paragraph' ) ];

const BlockSelector = ( { children, clientId } ) => {
	const { selectBlock } = useDispatch( blockEditorStore );

	useEffect( () => {
		if ( clientId ) {
			selectBlock( clientId );
		}
	}, [ clientId, selectBlock ] );

	return children;
};

const meta = {
	title: 'BlockEditor/BlockInspector',
	component: BlockInspector,
	parameters: {
		docs: {
			canvas: { sourceState: 'shown' },
			description: {
				component:
					'The Block inspector is one of the panels that is displayed in the editor; it is mainly used to view and modify the settings of the selected block.',
			},
		},
	},
	decorators: [
		( Story ) => (
			<ExperimentalBlockEditorProvider value={ blocks }>
				<Story />
			</ExperimentalBlockEditorProvider>
		),
	],
	argTypes: {
		showNoBlockSelectedMessage: {
			control: 'boolean',
			description:
				'Determines whether the Block Inspector displays a "No block selected" message or not when no block is selected.',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
	},
};

export default meta;

export const Default = {};

export const WithSelectedBlock = {
	decorators: [
		( Story ) => (
			<ExperimentalBlockEditorProvider value={ blocks }>
				<BlockSelector clientId={ blocks[ 0 ].clientId }>
					<Story />
				</BlockSelector>
			</ExperimentalBlockEditorProvider>
		),
	],
};
