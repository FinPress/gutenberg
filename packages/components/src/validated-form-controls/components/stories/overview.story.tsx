/**
 * WordPress dependencies
 */
import { useRef, useCallback, useState } from '@wordpress/element';

/**
 * External dependencies
 */
import type { Meta, StoryObj } from '@storybook/react';

/**
 * Internal dependencies
 */
import { ValidatedInputControl } from '..';
import { formDecorator } from './story-utils';
import type { ControlWithError } from '../../control-with-error';
import { debounce } from '@wordpress/compose';

const meta: Meta< typeof ControlWithError > = {
	title: 'Components (Experimental)/Validated Form Controls/Overview',
	tags: [ 'status-private' ],
	decorators: formDecorator,
};
export default meta;

type Story = StoryObj< typeof ControlWithError >;

/**
 * When there are multiple controls with errors, attempting to submit will
 * move focus to the first control with an error.
 */
export const WithMultipleControls: Story = {
	render: function Template() {
		const [ text, setText ] = useState( '' );
		const [ text2, setText2 ] = useState( '' );
		const [ customValidityMessage, setCustomValidityMessage ] =
			useState<
				React.ComponentProps<
					typeof ValidatedInputControl
				>[ 'customValidityMessage' ]
			>( undefined );
		const [ customValidityMessage2, setCustomValidityMessage2 ] =
			useState<
				React.ComponentProps<
					typeof ValidatedInputControl
				>[ 'customValidityMessage' ]
			>( undefined );

		return (
			<>
				<ValidatedInputControl
					label="Text"
					required
					value={ text }
					help="The word 'error' will trigger an error."
					onValidate={ ( value ) => {
						if ( value?.toLowerCase() === 'error' ) {
							setCustomValidityMessage( {
								type: 'invalid',
								message: 'The word "error" is not allowed.',
							} );
						} else {
							setCustomValidityMessage( undefined );
						}
					} }
					customValidityMessage={ customValidityMessage }
					onChange={ ( value ) => setText( value ?? '' ) }
				/>
				<ValidatedInputControl
					label="Text"
					required
					value={ text2 }
					help="The word 'error' will trigger an error."
					onValidate={ ( value ) => {
						if ( value?.toLowerCase() === 'error' ) {
							setCustomValidityMessage2( {
								type: 'invalid',
								message: 'The word "error" is not allowed.',
							} );
						} else {
							setCustomValidityMessage2( undefined );
						}
					} }
					onChange={ ( value ) => setText2( value ?? '' ) }
					customValidityMessage={ customValidityMessage2 }
				/>
			</>
		);
	},
};

/**
 * Help text can be configured to be hidden when a custom error is reported. Whether to opt for this approach
 * will depend on context.
 */
export const WithHelpTextReplacement: Story = {
	render: function Template() {
		const [ text, setText ] = useState( '' );
		const [ customValidityMessage, setCustomValidityMessage ] =
			useState<
				React.ComponentProps<
					typeof ValidatedInputControl
				>[ 'customValidityMessage' ]
			>( undefined );

		return (
			<ValidatedInputControl
				label="Text"
				required
				value={ text }
				help={
					customValidityMessage
						? undefined
						: 'The word "error" is not allowed.'
				}
				onValidate={ ( value ) => {
					if ( value?.toLowerCase() === 'error' ) {
						setCustomValidityMessage( {
							type: 'invalid',
							message: 'The word "error" is not allowed.',
						} );
					} else {
						setCustomValidityMessage( undefined );
					}
				} }
				onChange={ ( value ) => setText( value ?? '' ) }
				customValidityMessage={ customValidityMessage }
			/>
		);
	},
};

/**
 * To provide feedback from server-side validation, the `customValidityMessage` prop can be used
 * to show additional status indicators while waiting for the server response,
 * and after the response is received.
 */
export const AsyncValidation: StoryObj< typeof ValidatedInputControl > = {
	render: function Template( { ...args } ) {
		const [ text, setText ] = useState( '' );
		const [ customValidityMessage, setCustomValidityMessage ] =
			useState<
				React.ComponentProps<
					typeof ValidatedInputControl
				>[ 'customValidityMessage' ]
			>( undefined );

		const timeoutRef = useRef< ReturnType< typeof setTimeout > >();
		const previousValidationValueRef = useRef< unknown >( '' );

		// eslint-disable-next-line react-hooks/exhaustive-deps
		const debouncedValidate = useCallback(
			debounce( ( v ) => {
				if ( v === previousValidationValueRef.current ) {
					return;
				}

				previousValidationValueRef.current = v;

				setCustomValidityMessage( {
					type: 'validating',
					message: 'Validating...',
				} );

				clearTimeout( timeoutRef.current );
				timeoutRef.current = setTimeout( () => {
					if ( v?.toString().toLowerCase() === 'error' ) {
						setCustomValidityMessage( {
							type: 'invalid',
							message: 'The word "error" is not allowed.',
						} );
					} else {
						setCustomValidityMessage( {
							type: 'valid',
							message: 'Validated',
						} );
					}
				}, 2000 );
			}, 500 ),
			[]
		);

		return (
			<ValidatedInputControl
				{ ...args }
				value={ text }
				onChange={ ( newValue ) => {
					setText( newValue ?? '' );
				} }
				onValidate={ ( v ) => {
					if ( ! v ) {
						return;
					}

					debouncedValidate( v );
				} }
				customValidityMessage={ customValidityMessage }
			/>
		);
	},
};
AsyncValidation.args = {
	label: 'Text',
	help: 'The word "error" will trigger an error asynchronously.',
};
