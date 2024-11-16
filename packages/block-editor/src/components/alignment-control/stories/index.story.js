/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AlignmentControl } from '../';

/**
 * The `AlignmentControl` component renders a dropdown menu that displays alignment options for the selected block.
 *
 * This component is mostly used for blocks that display text, such as Heading, Paragraph, Post Author, Post Comments, Verse, Quote, Post Title, etc... And the available alignment options are `left`, `center` or `right` alignment.
 *
 * If you want to use the alignment control in a toolbar, you should use the `AlignmentToolbar` component instead.
 */
const meta = {
	title: 'BlockEditor/AlignmentControl',
	component: AlignmentControl,
	argTypes: {
		value: {
			control: {
				type: 'select',
				options: [ 'undefined', 'left', 'center', 'right' ],
				defaultValue: 'undefined',
			},
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
		<AlignmentControl
			{ ...args }
			onChange={ ( ...changeArgs ) => {
				onChange( ...changeArgs );
				setValue( ...changeArgs );
			} }
			value={ value }
		/>
	);
};

export const Default = Template.bind();
