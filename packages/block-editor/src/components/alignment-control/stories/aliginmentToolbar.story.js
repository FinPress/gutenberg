/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AlignmentToolbar } from '..';

/**
 * The `AlignmentToolbar` component renders a dropdown menu that displays alignment options for the selected block in `Toolbar`.
 */
const meta = {
	title: 'BlockEditor/AlignmentToolbar',
	component: AlignmentToolbar,
	argTypes: {
		value: {
			control: { type: null },
			defaultValue: 'undefined',
			description: 'The current value of the alignment setting.',
		},
		onChange: {
			action: 'onChange',
			control: { type: null },
			description:
				"A callback function invoked when the toolbar's alignment value is changed via an interaction with any of the toolbar's buttons. Called with the new alignment value (ie: `left`, `center`, `right`, `undefined`) as the only argument.",
		},
	},
};
export default meta;

const Template = ( { onChange, ...args } ) => {
	const [ value, setValue ] = useState();
	return (
		<AlignmentToolbar
			{ ...args }
			onChange={ ( ...changeArgs ) => {
				onChange( ...changeArgs );
				setValue( ...changeArgs );
			} }
			value={ value }
		/>
	);
};

export const Default = Template.bind( {
	args: {
		value: 'undefined',
	},
} );
