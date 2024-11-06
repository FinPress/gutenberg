/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { registerCoreBlocks } from '@wordpress/block-library';
import { useDispatch } from '@wordpress/data';
import { Toolbar } from '@wordpress/components';

/**
 * Internal dependencies
 */
import BlockMover from '../';
import { ExperimentalBlockEditorProvider } from '../../provider';
import { store as blockEditorStore } from '../../../store';

// For the purpose of this story, we need to register the core blocks samples.
registerCoreBlocks();
const blocks = [
	// vertical
	createBlock( 'core/group', { layout: { type: 'flex' } }, [
		createBlock( 'core/paragraph' ),
		createBlock( 'core/paragraph' ),
		createBlock( 'core/paragraph' ),
	] ),
	// horizontal
	createBlock( 'core/buttons', {}, [
		createBlock( 'core/button' ),
		createBlock( 'core/button' ),
		createBlock( 'core/button' ),
	] ),
];

function BlockMoverStoryHorizontal() {
	const { updateBlockListSettings } = useDispatch( blockEditorStore );

	useEffect( () => {
		/**
		 * This shouldn't be needed but unfortunately
		 * the layout orientation is not declarative, we need
		 * to render the blocks to update the block settings in the state.
		 */
		updateBlockListSettings( blocks[ 1 ].clientId, {
			orientation: 'horizontal',
		} );
	} );

	return (
		<Toolbar label="Block Mover">
			<BlockMover
				clientIds={
					blocks.length
						? [ blocks[ 1 ].innerBlocks[ 1 ].clientId ]
						: []
				}
			/>
		</Toolbar>
	);
}

const meta = {
	title: 'BlockEditor/BlockMover',
	component: BlockMover,
	parameters: {
		controls: { expanded: true },
		docs: { canvas: { sourceState: 'shown' } },
	},
};
export default meta;

const Template = ( props ) => {
	return (
		<ExperimentalBlockEditorProvider>
			<Toolbar label="Block Mover">
				<BlockMover
					{ ...props }
					clientIds={
						blocks.length
							? [ blocks[ 1 ].innerBlocks[ 1 ].clientId ]
							: []
					}
				/>
			</Toolbar>
		</ExperimentalBlockEditorProvider>
	);
};

export const Default = Template.bind( {} );
Default.args = {
	clientIds: [
		blocks.length ? [ blocks[ 0 ].innerBlocks[ 1 ].clientId ] : [],
	],
};

/**
 * This story shows the block mover with horizontal orientation.
 * It is necessary to render the blocks to update the block settings in the state.
 */
export const Horizontal = ( props ) => {
	return (
		<ExperimentalBlockEditorProvider>
			<BlockMoverStoryHorizontal { ...props } />
		</ExperimentalBlockEditorProvider>
	);
};
Horizontal.args = {
	clientIds: [
		blocks.length ? [ blocks[ 1 ].innerBlocks[ 1 ].clientId ] : [],
	],
};
Horizontal.parameters = {
	docs: { canvas: { sourceState: 'hidden' } },
};

/**
 * You can hide the drag handle by `hideDragHandle` attribute.
 */
export const HideDragHandle = ( props ) => {
	return (
		<ExperimentalBlockEditorProvider>
			<Toolbar label="Block Mover">
				<BlockMover
					{ ...props }
					clientIds={
						blocks.length
							? [ blocks[ 1 ].innerBlocks[ 1 ].clientId ]
							: []
					}
					hideDragHandle
				/>
			</Toolbar>
		</ExperimentalBlockEditorProvider>
	);
};
HideDragHandle.args = {
	...Default.args,
	hideDragHandle: true,
};
