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
import { ValidatedComboboxControl } from '../combobox-control';
import { formDecorator } from './story-utils';

const meta: Meta< typeof ValidatedComboboxControl > = {
	title: 'Components (Experimental)/Validated Form Controls/ValidatedComboboxControl',
	component: ValidatedComboboxControl,
	tags: [ 'status-private' ],
	decorators: formDecorator,
	args: { onChange: () => {} },
	argTypes: {
		value: { control: false },
	},
};
export default meta;

export const Default: StoryObj< typeof ValidatedComboboxControl > = {
	render: function Template( { onChange, ...args } ) {
		const [ value, setValue ] =
			useState<
				React.ComponentProps<
					typeof ValidatedComboboxControl
				>[ 'value' ]
			>();
		const [ customValidityMessage, setCustomValidityMessage ] =
			useState<
				React.ComponentProps<
					typeof ValidatedComboboxControl
				>[ 'customValidityMessage' ]
			>( undefined );

		return (
			<ValidatedComboboxControl
				{ ...args }
				value={ value }
				onChange={ ( newValue ) => {
					setValue( newValue );
					onChange?.( newValue );
				} }
				onValidate={ ( v ) => {
					if ( v === 'a' ) {
						setCustomValidityMessage( {
							type: 'invalid',
							message: 'Option A is not allowed.',
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
	label: 'Combobox',
	help: 'Option A is not allowed.',
	options: [
		{ value: 'a', label: 'Option A (not allowed)' },
		{ value: 'b', label: 'Option B' },
	],
};
