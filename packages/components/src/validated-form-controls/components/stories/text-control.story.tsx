/**
 * WordPress dependencies
 */
import { debounce } from '@wordpress/compose';
import { useCallback, useRef, useState } from '@wordpress/element';

/**
 * External dependencies
 */
import type { StoryObj, Meta } from '@storybook/react';

/**
 * Internal dependencies
 */
import { formDecorator } from './story-utils';
import { ValidatedTextControl } from '../text-control';

const meta: Meta< typeof ValidatedTextControl > = {
	title: 'Components (Experimental)/Validated Form Controls/ValidatedTextControl',
	component: ValidatedTextControl,
	tags: [ 'status-private' ],
	decorators: formDecorator,
	args: { onChange: () => {} },
	argTypes: {
		value: { control: false },
	},
};
export default meta;

export const Default: StoryObj< typeof ValidatedTextControl > = {
	render: function Template( { onChange, ...args } ) {
		const [ value, setValue ] = useState( '' );
		const [ customValidityMessage, setCustomValidityMessage ] =
			useState<
				React.ComponentProps<
					typeof ValidatedTextControl
				>[ 'customValidityMessage' ]
			>( undefined );

		return (
			<ValidatedTextControl
				{ ...args }
				value={ value }
				onChange={ ( newValue ) => {
					setValue( newValue );
					onChange?.( newValue );
				} }
				onValidate={ ( v ) => {
					if ( v?.toString().toLowerCase() === 'error' ) {
						setCustomValidityMessage( {
							type: 'invalid',
							message: 'The word "error" is not allowed.',
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
	label: 'Text',
	help: "The word 'error' will trigger an error.",
};

export const AsyncValidation: StoryObj< typeof ValidatedTextControl > = {
	render: function Template( { onChange, ...args } ) {
		const [ value, setValue ] = useState( '' );
		const [ customValidityMessage, setCustomValidityMessage ] =
			useState<
				React.ComponentProps<
					typeof ValidatedTextControl
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
			<ValidatedTextControl
				{ ...args }
				value={ value }
				onChange={ ( newValue ) => {
					setValue( newValue );
					onChange?.( newValue );
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
	label: 'Text with async validation',
	help: "The word 'error' will trigger an error asynchronously.",
};
