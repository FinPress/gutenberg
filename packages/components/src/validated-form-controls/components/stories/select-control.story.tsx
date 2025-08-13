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
import { ValidatedSelectControl } from '../select-control';
import { formDecorator } from './story-utils';

const meta: Meta< typeof ValidatedSelectControl > = {
	title: 'Components (Experimental)/Validated Form Controls/ValidatedSelectControl',
	component: ValidatedSelectControl,
	tags: [ 'status-private' ],
	decorators: formDecorator,
	args: { onChange: () => {} },
	argTypes: {
		value: { control: false },
	},
};
export default meta;

export const Default: StoryObj< typeof ValidatedSelectControl > = {
	render: function Template( { onChange, ...args } ) {
		const [ value, setValue ] = useState( '' );
		const [ customValidityMessage, setCustomValidityMessage ] =
			useState<
				React.ComponentProps<
					typeof ValidatedSelectControl
				>[ 'customValidityMessage' ]
			>( undefined );

		return (
			<ValidatedSelectControl
				{ ...args }
				value={ value }
				onChange={ ( newValue ) => {
					setValue( newValue );
					onChange?.( newValue );
				} }
				onValidate={ ( v ) => {
					if ( v === '1' ) {
						setCustomValidityMessage( {
							type: 'invalid',
							message: 'Option 1 is not allowed.',
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
	label: 'Select',
	help: 'Selecting option 1 will trigger an error.',
	options: [
		{ value: '', label: 'Select an option' },
		{ value: '1', label: 'Option 1 (not allowed)' },
		{ value: '2', label: 'Option 2' },
	],
};
