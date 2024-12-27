/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ResponsiveBlockControl from '..';

const meta = {
	title: 'BlockEditor/ResponsiveBlockControl',
	component: ResponsiveBlockControl,
	parameters: {
		docs: {
			description: {
				component:
					'The `ResponsiveBlockControl` component provides a UI to toggle between a single value for all screen sizes and custom values for different screen sizes.',
			},
		},
	},
	argTypes: {
		title: {
			description: 'The title displayed above the control.',
			control: 'text',
		},
		property: {
			description:
				'The CSS property controlled by the component (e.g., "margin").',
			control: 'text',
		},
		toggleLabel: {
			description: 'Custom label for the toggle control.',
			control: 'text',
		},
		isResponsive: {
			description:
				'Controls whether the responsive options are displayed.',
			control: 'boolean',
		},
		defaultLabel: {
			description: 'Default label for the "All" control.',
			control: 'object',
		},
		viewports: {
			description:
				'Defines the viewport labels and IDs for responsive controls.',
			control: 'object',
		},
		onIsResponsiveChange: {
			description:
				'Callback function triggered when the toggle state changes.',
			action: 'onIsResponsiveChange',
		},
		renderDefaultControl: {
			description:
				'Function to render the default (non-responsive) control.',
		},
		renderResponsiveControls: {
			description: 'Function to render custom responsive controls.',
		},
	},
};
export default meta;

const Template = ( args ) => {
	const [ isResponsive, setIsResponsive ] = useState( args.isResponsive );

	const renderDefaultControl = ( label ) => (
		<div>
			{ label }
			<input type="text" placeholder="Enter value" />
		</div>
	);

	return (
		<ResponsiveBlockControl
			{ ...args }
			isResponsive={ isResponsive }
			onIsResponsiveChange={ () => setIsResponsive( ! isResponsive ) }
			renderDefaultControl={ renderDefaultControl }
		/>
	);
};

export const Default = {
	render: Template,
	args: {
		title: 'Margin',
		property: 'margin',
		toggleLabel: 'Use the same margin on all screen sizes',
		defaultLabel: {
			id: 'all',
			label: 'All',
		},
		viewports: [
			{ id: 'small', label: 'Small screens' },
			{ id: 'medium', label: 'Medium screens' },
			{ id: 'large', label: 'Large screens' },
		],
		isResponsive: false,
	},
};
