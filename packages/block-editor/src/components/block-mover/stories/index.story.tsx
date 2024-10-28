/**
 * External dependencies
 */
import type { Meta, StoryFn } from '@storybook/react';

/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { Toolbar } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { registerCoreBlocks } from '@wordpress/block-library';

/**
 * Internal dependencies
 */
import BlockMover from '../';
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
	const { updateBlockListSettings } = useDispatch( blockEditorStore );

	useEffect( () => {
		/**
		 * This shouldn't be needed but unfortunatley
		 * the layout orientation is not declarative, we need
		 *  to render the blocks to update the block settings in the state.
		 */
		updateBlockListSettings( blocks[ 1 ].clientId, {
			orientation: 'horizontal',
		} );
	}, [ updateBlockListSettings ] );
	return (
		<Toolbar label="Block Mover">
			<BlockMover { ...props } />
		</Toolbar>
	);
};

export const Default: StoryFn< typeof BlockMover > = Template.bind( {} );
Default.args = {
	clientIds: [
		blocks.length ? [ blocks[ 0 ].innerBlocks[ 1 ].clientId ] : [],
	],
};

/**
 * Also have horizontal orientation.
 */
export const Horizontal: StoryFn< typeof BlockMover > = Template.bind( {} );
Horizontal.args = {
	clientIds: [
		blocks.length ? [ blocks[ 1 ].innerBlocks[ 1 ].clientId ] : [],
	],
};

/**
 * We can also hide the drag handle.
 */
export const HideDragHandle: StoryFn< typeof BlockMover > = Template.bind( {} );
HideDragHandle.args = {
	clientIds: [
		blocks.length ? [ blocks[ 1 ].innerBlocks[ 0 ].clientId ] : [],
	],
	hideDragHandle: true,
};
