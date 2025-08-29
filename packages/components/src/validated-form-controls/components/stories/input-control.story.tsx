/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * External dependencies
 */
import type { StoryObj, Meta } from '@storybook/react';

/**
 * WordPress dependencies
 */
import { seen, unseen } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { ValidatedInputControl } from '../input-control';
import { ValidatedFormTokenField } from '../array-control';
import { formDecorator } from './story-utils';
import InputControlSuffixWrapper from '../../../input-control/input-suffix-wrapper';
import { Button } from '../../../button';
import type { TokenItem } from '../../../form-token-field/types';

const meta: Meta< typeof ValidatedInputControl > = {
	title: 'Components/Selection & Input/Validated Form Controls/ValidatedInputControl',
	id: 'components-validatedinputcontrol',
	component: ValidatedInputControl,
	tags: [ 'status-private' ],
	decorators: formDecorator,
	args: { onChange: () => {} },
	argTypes: {
		__unstableInputWidth: { control: { type: 'text' } },
		__unstableStateReducer: { control: false },
		onChange: { control: false },
		prefix: { control: false },
		suffix: { control: false },
		type: { control: { type: 'text' } },
		value: { control: false },
	},
};
export default meta;

export const Default: StoryObj< typeof ValidatedInputControl > = {
	render: function Template( { onChange, ...args } ) {
		const [ value, setValue ] =
			useState<
				React.ComponentProps< typeof ValidatedInputControl >[ 'value' ]
			>( '' );
		const [ customValidity, setCustomValidity ] =
			useState<
				React.ComponentProps<
					typeof ValidatedInputControl
				>[ 'customValidity' ]
			>( undefined );

		return (
			<ValidatedInputControl
				{ ...args }
				value={ value }
				onChange={ ( newValue, ...rest ) => {
					setValue( newValue );
					onChange?.( newValue, ...rest );
				} }
				onValidate={ ( v ) => {
					if ( v?.toLowerCase() === 'error' ) {
						setCustomValidity( {
							type: 'invalid',
							message: 'The word "error" is not allowed.',
						} );
					} else {
						setCustomValidity( undefined );
					}
				} }
				customValidity={ customValidity }
			/>
		);
	},
};
Default.args = {
	required: true,
	label: 'Input',
	help: 'The word "error" will trigger an error.',
};

/**
 * This demonstrates how password validation would work with the standard implementation.
 *
 * We are planning to move to a custom implementation more tailored to the password use case.
 */
export const Password: StoryObj< typeof ValidatedInputControl > = {
	render: function Template( { onChange, ...args } ) {
		const [ value, setValue ] =
			useState<
				React.ComponentProps< typeof ValidatedInputControl >[ 'value' ]
			>( '' );
		const [ visible, setVisible ] = useState( false );
		const [ customValidity, setCustomValidity ] =
			useState<
				React.ComponentProps<
					typeof ValidatedInputControl
				>[ 'customValidity' ]
			>( undefined );

		return (
			<ValidatedInputControl
				{ ...args }
				type={ visible ? 'text' : 'password' }
				suffix={
					<InputControlSuffixWrapper variant="control">
						<Button
							size="small"
							icon={ visible ? unseen : seen }
							onClick={ () => setVisible( ( v ) => ! v ) }
							label={
								visible ? 'Hide password' : 'Show password'
							}
						/>
					</InputControlSuffixWrapper>
				}
				value={ value }
				onChange={ ( newValue, ...rest ) => {
					setValue( newValue );
					onChange?.( newValue, ...rest );
				} }
				onValidate={ ( v ) => {
					if ( ! /\d/.test( v ?? '' ) ) {
						setCustomValidity( {
							type: 'invalid',
							message:
								'Password must include at least one number.',
						} );
						return;
					}
					if ( ! /[A-Z]/.test( v ?? '' ) ) {
						setCustomValidity( {
							type: 'invalid',
							message:
								'Password must include at least one capital letter.',
						} );
						return;
					}
					if ( ! /[!@£$%^&*#]/.test( v ?? '' ) ) {
						setCustomValidity( {
							type: 'invalid',
							message:
								'Password must include at least one symbol.',
						} );
						return;
					}
					setCustomValidity( undefined );
				} }
				customValidity={ customValidity }
			/>
		);
	},
};
Password.args = {
	required: true,
	label: 'Password',
	help: 'Minimum 8 characters, include a number, capital letter, and symbol (!@£$%^&*#).',
	minLength: 8,
};
Password.argTypes = {
	suffix: { control: false },
	type: { control: false },
};

/**
 * This demonstrates how array validation would work with the ValidatedFormTokenField component.
 */
export const ArrayControl: StoryObj< typeof ValidatedFormTokenField > = {
	render: function Template( { onChange, ...args } ) {
		const [ value, setValue ] = useState< ( string | TokenItem )[] >( [] );
		const [ customValidity, setCustomValidity ] =
			useState<
				React.ComponentProps<
					typeof ValidatedFormTokenField
				>[ 'customValidity' ]
			>( undefined );

		return (
			<ValidatedFormTokenField
				{ ...args }
				value={ value }
				onChange={ ( newValue, ...rest ) => {
					setValue( newValue );
					onChange?.( newValue, ...rest );
				} }
				onValidate={ ( v ) => {
					if (
						v?.some( ( token ) => {
							const tokenValue =
								typeof token === 'string' ? token : token.value;
							return tokenValue.toLowerCase() === 'error';
						} )
					) {
						setCustomValidity( {
							type: 'invalid',
							message: 'The tag "error" is not allowed.',
						} );
						return;
					}

					setCustomValidity( undefined );
				} }
				customValidity={ customValidity }
			/>
		);
	},
};
ArrayControl.args = {
	required: true,
	label: 'Tags',
	placeholder: 'Add tags...',
	suggestions: [ 'Posts', 'Pages', 'Media', 'Error' ],
};
