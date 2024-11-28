/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BlockRenameControl from '../rename-control';

export default {
	component: BlockRenameControl,
	title: 'BlockEditor/BlockRenameControl',
};

export const Default = {
	render: function Template( props ) {
		const [ value, setValue ] = useState( 'New Name' );
		return (
			<BlockRenameControl
				label="Rename"
				value={ value }
				onChange={ setValue }
				{ ...props }
			/>
		);
	},
	args: {
		__nextHasNoMarginBottom: true,
	},
};
