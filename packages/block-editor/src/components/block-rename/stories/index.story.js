/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
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
		const [ value, setValue ] = useState( __( 'New Name' ) );
		return (
			<BlockRenameControl
				label={ __( 'Rename' ) }
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
