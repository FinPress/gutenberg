/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * External dependencies
 */
import type { StoryObj, Meta } from '@storybook/react';

/**
 * Internal dependencies
 */
import { formDecorator } from './story-utils';
import { ValidatedToggleControl } from '../toggle-control';

const meta: Meta< typeof ValidatedToggleControl > = {
	title: 'Components (Experimental)/Validated Form Controls/ValidatedToggleControl',
	component: ValidatedToggleControl,
	tags: [ 'status-private' ],
	decorators: formDecorator,
	args: { onChange: () => {} },
	argTypes: {
		checked: { control: false },
	},
};
export default meta;

export const Default: StoryObj< typeof ValidatedToggleControl > = {
	render: function Template( { onChange, ...args } ) {
		const [ checked, setChecked ] = useState( false );
		const [ customValidityMessage, setCustomValidityMessage ] =
			useState<
				React.ComponentProps<
					typeof ValidatedToggleControl
				>[ 'customValidityMessage' ]
			>( undefined );

		return (
			<ValidatedToggleControl
				{ ...args }
				checked={ checked }
				onChange={ ( value ) => {
					setChecked( value );
					onChange?.( value );
				} }
				onValidate={ ( v ) => {
					if ( v ) {
						setCustomValidityMessage( {
							type: 'invalid',
							message: 'This toggle may not be enabled.',
						} );
					} else {
						setCustomValidityMessage( undefined );
					}
				} }
				customValidityMessage={ customValidityMessage }
			/>
		);
	},
};
Default.args = {
	required: true,
	label: 'Toggle',
	help: 'This toggle may neither be enabled nor disabled.',
};
