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
import { ValidatedNumberControl } from '../number-control';
import { formDecorator } from './story-utils';

const meta: Meta< typeof ValidatedNumberControl > = {
	title: 'Components (Experimental)/Validated Form Controls/ValidatedNumberControl',
	component: ValidatedNumberControl,
	tags: [ 'status-private' ],
	decorators: formDecorator,
	args: { onChange: () => {} },
	argTypes: {
		prefix: { control: { type: 'text' } },
		step: { control: { type: 'text' } },
		suffix: { control: { type: 'text' } },
		type: { control: { type: 'text' } },
		value: { control: false },
	},
};
export default meta;

export const Default: StoryObj< typeof ValidatedNumberControl > = {
	render: function Template( { onChange, ...args } ) {
		const [ value, setValue ] =
			useState<
				React.ComponentProps< typeof ValidatedNumberControl >[ 'value' ]
			>();
		const [ customValidityMessage, setCustomValidityMessage ] =
			useState<
				React.ComponentProps<
					typeof ValidatedNumberControl
				>[ 'customValidityMessage' ]
			>( undefined );

		return (
			<ValidatedNumberControl
				{ ...args }
				value={ value }
				onChange={ ( newValue, ...rest ) => {
					setValue( newValue );
					onChange?.( newValue, ...rest );
				} }
				onValidate={ ( v ) => {
					if ( v && parseInt( v.toString(), 10 ) % 2 !== 0 ) {
						setCustomValidityMessage( {
							type: 'invalid',
							message: 'Choose an even number.',
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
	label: 'Number',
	help: 'Odd numbers are not allowed.',
};
