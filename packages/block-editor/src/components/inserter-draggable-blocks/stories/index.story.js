/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';
import { registerCoreBlocks } from '@wordpress/block-library';
import { paragraph, heading, image } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import InserterDraggableBlocks from '../';
import { useState } from '@wordpress/element';

// Register core blocks to make them available for use
registerCoreBlocks();

const meta = {
	title: 'BlockEditor/InserterDraggableBlocks',
	component: InserterDraggableBlocks,
	parameters: {
		docs: {
			description: {
				component:
					'The `InserterDraggableBlocks` component allows users to drag and drop blocks from the inserter.',
			},
		},
	},
	argTypes: {
		isEnabled: {
			description: 'Whether dragging is enabled for the component.',
			control: 'boolean',
			defaultValue: true,
		},
		blocks: {
			description: 'Array of blocks to make draggable.',
			control: 'object',
			defaultValue: undefined,
		},

		icon: {
			control: 'select',
			options: {
				Paragraph: paragraph,
				Heading: heading,
				Image: image,
			},
			default: 'undefined',
			description: 'Optional icon for the draggable component.',
		},

		children: {
			description: 'Render function for child elements.',
			control: false,
		},
		pattern: {
			description:
				'Optional block pattern for the drag-and-drop functionality.',
			control: 'object',
		},
	},
};
export default meta;

const Template = ( args ) => {
	const [ dragged, setDragged ] = useState( false );

	return (
		<div
			style={ {
				padding: '20px',
				border: '1px dashed #ccc',
				width: '300px',
			} }
		>
			<p>{ __( 'Drag the blocks below:' ) }</p>
			<InserterDraggableBlocks
				{ ...args }
				children={ ( { draggable, onDragStart, onDragEnd } ) => {
					return (
						<div
							style={ {
								background: draggable ? '#e3f7ff' : '#f7f7f7',
								padding: '10px',
								cursor: draggable ? 'grab' : 'not-allowed',
								display: 'flex',
								flexDirection: 'column',
								gap: '10px',
							} }
							onDragStart={ onDragStart }
							onDragEnd={ ( e ) => {
								onDragEnd( e );
								setDragged( true );
							} }
							draggable={ draggable }
						>
							<div>{ `${ __( 'Number of Draggable blocks:' ) } ${
								args.blocks.length
							}` }</div>
							<div>
								{ dragged
									? __( 'Blocks dragged!' )
									: __(
											'Drag me to test the functionality.'
									  ) }
							</div>
						</div>
					);
				} }
			/>
		</div>
	);
};

export const Default = {
	render: Template,
	args: {
		isEnabled: true,
		blocks: [
			createBlock( 'core/paragraph', {
				content: 'Draggable paragraph block',
			} ),
			createBlock( 'core/heading', {
				content: 'Draggable heading block',
			} ),
		],
		icon: paragraph,
		pattern: null,
	},
};
