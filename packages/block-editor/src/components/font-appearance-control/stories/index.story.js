/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import FontAppearanceControl from '../';

const meta = {
	title: 'BlockEditor/FontAppearanceControl',
	component: FontAppearanceControl,
	parameters: {
		docs: {
			description: {
				component:
					'`FontAppearanceControl` is used to display and select font style and weight options for a font family.',
			},
		},
	},
	argTypes: {
		hasFontStyles: {
			control: 'boolean',
			description: 'Enable or disable font styles.',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
		hasFontWeights: {
			control: 'boolean',
			description: 'Enable or disable font weights.',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
		fontFamilyFaces: {
			control: 'object',
			description: 'Font faces including style and weight definitions.',
			table: {
				type: { summary: 'Array' },
				defaultValue: { summary: 'undefined' },
			},
		},
		value: {
			control: 'object',
			description: 'The currently selected font style and weight.',
			table: {
				type: { summary: 'object' },
				defaultValue: { summary: '{}' },
			},
		},
		onChange: {
			action: 'changed',
			description: 'Callback function triggered when the value changes.',
			table: {
				type: { summary: 'function' },
			},
		},
	},
};

export default meta;

const Template = ( args ) => {
	const [ value, setValue ] = useState( {
		fontStyle: undefined,
		fontWeight: undefined,
	} );

	return (
		<FontAppearanceControl
			{ ...args }
			value={ value }
			onChange={ ( newStyle ) => {
				setValue( newStyle );
				args.onChange( newStyle );
			} }
		/>
	);
};

export const Default = {
	render: Template,
	args: {
		hasFontStyles: true,
		hasFontWeights: true,
		fontFamilyFaces: [
			{
				fontFamily: 'ExampleFont',
				fontStyle: 'italic',
				fontWeight: '400',
			},
			{
				fontFamily: 'ExampleFont',
				fontStyle: 'normal',
				fontWeight: '700',
			},
		],
	},
};
