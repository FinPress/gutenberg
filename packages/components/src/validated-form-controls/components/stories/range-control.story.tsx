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
import { ValidatedRangeControl } from '../range-control';

const meta: Meta< typeof ValidatedRangeControl > = {
	title: 'Components (Experimental)/Validated Form Controls/ValidatedRangeControl',
	component: ValidatedRangeControl,
	tags: [ 'status-private' ],
	decorators: formDecorator,
	args: { onChange: () => {} },
	argTypes: {
		value: { control: false },
	},
};
export default meta;

export const Default: StoryObj< typeof ValidatedRangeControl > = {
	render: function Template( { onChange, ...args } ) {
		const [ value, setValue ] =
			useState<
				React.ComponentProps< typeof ValidatedRangeControl >[ 'value' ]
			>();
		const [ customValidityMessage, setCustomValidityMessage ] =
			useState<
				React.ComponentProps<
					typeof ValidatedRangeControl
				>[ 'customValidityMessage' ]
			>( undefined );

		return (
			<ValidatedRangeControl
				{ ...args }
				value={ value }
				onChange={ ( newValue ) => {
					setValue( newValue );
					onChange?.( newValue );
				} }
				onValidate={ ( v ) => {
					if ( v && v % 2 !== 0 ) {
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
	label: 'Range',
	help: 'Odd numbers are not allowed.',
	min: 0,
	max: 20,
};
