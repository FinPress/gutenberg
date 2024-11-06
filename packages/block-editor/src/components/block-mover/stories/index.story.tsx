/**
 * External dependencies
 */
import type { Meta, StoryFn } from '@storybook/react';

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

// Provider component to wrap the BlockEditorProvider
function Provider( { children } ) {
	return (
		<ExperimentalBlockEditorProvider value={ blocks }>
			{ children }
		</ExperimentalBlockEditorProvider>
	);
}

function BlockMoverStoryHorizontal() {
	const { updateBlockListSettings } = useDispatch( blockEditorStore );

	useEffect( () => {
		/**
		 * This shouldn't be needed but unfortunately
		 * the layout orientation is not declarative, we need
		 *  to render the blocks to update the block settings in the state.
		 */
		updateBlockListSettings( blocks[ 1 ].clientId, {
			orientation: 'horizontal',
		} );
	}, [] );

	return (
		<div>
			<Toolbar label="Block Mover">
				<BlockMover
					clientIds={
						blocks.length
							? [ blocks[ 1 ].innerBlocks[ 1 ].clientId ]
							: []
					}
				/>
			</Toolbar>
		</div>
	);
}

const meta: Meta< typeof BlockMover > = {
	title: 'BlockEditor/BlockMover',
	component: BlockMover,
	parameters: {
		controls: { expanded: true },
		docs: { canvas: { sourceState: 'shown' } },
	},
};
export default meta;

const Template: StoryFn< typeof BlockMover > = ( props ) => {
	return (
		<Provider>
			<div>
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
			</div>
		</Provider>
	);
};

export const Default: StoryFn< typeof BlockMover > = Template.bind( {} );
Default.args = {
	clientIds: [
		blocks.length ? [ blocks[ 0 ].innerBlocks[ 1 ].clientId ] : [],
	],
};

/**
 * This story shows the block mover with horizontal orientation.
 * It is necessary to render the blocks to update the block settings in the state.
 */
export const Horizontal: StoryFn< typeof BlockMover > = ( props ) => {
	return (
		<Provider>
			<BlockMoverStoryHorizontal { ...props } />
		</Provider>
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
export const HideDragHandle: StoryFn< typeof BlockMover > = ( props ) => {
	return (
		<Provider>
			<div>
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
			</div>
		</Provider>
	);
};
HideDragHandle.args = {
	...Default.args,
	hideDragHandle: true,
};
