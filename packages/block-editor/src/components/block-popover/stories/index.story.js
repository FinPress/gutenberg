/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import BlockPopover from '../index';

const meta = {
	title: 'BlockEditor/BlockPopover',
	component: BlockPopover,
	parameters: {
		docs: {
			description: {
				component:
					'The BlockPopover component renders editor UI by the block in a popover, positioned outside the canvas to avoid interfering with the block list layout.',
			},
		},
	},
	argTypes: {
		clientId: {
			control: 'text',
			description:
				'The client ID of the block representing the top position of the popover.',
		},
		bottomClientId: {
			control: 'text',
			description:
				'The client ID of the block representing the bottom position of the popover.',
		},
		shift: {
			control: 'boolean',
			description:
				'Determines whether the block popover always shifts into the viewport or remains at its original position.',
			defaultValue: true,
		},
	},
};

export default meta;

export const Default = {
	render: function Template( { clientId, bottomClientId, shift, ...args } ) {
		const [ isPopoverVisible, setPopoverVisible ] = useState( false );

		const togglePopover = () => {
			setPopoverVisible( ( prev ) => ! prev );
		};

		return (
			<>
				<Button onClick={ togglePopover }>
					{ isPopoverVisible ? 'Hide Popover' : 'Show Popover' }
				</Button>
				{ isPopoverVisible && (
					<BlockPopover
						clientId={ clientId }
						bottomClientId={ bottomClientId }
						shift={ shift }
						{ ...args }
					>
						<div
							style={ {
								backgroundColor: 'white',
								border: '1px solid #ddd',
								padding: '10px',
							} }
						>
							This is a block popover example.
						</div>
					</BlockPopover>
				) }
			</>
		);
	},
	args: {
		clientId: 'example-client-id',
		bottomClientId: '',
		shift: true,
	},
};
