/**
 * WordPress dependencies
 */
import { privateApis } from '@wordpress/components';
import { useState, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { DataFormControlProps } from '../types';
import { unlock } from '../lock-unlock';

const { ValidatedToggleControl } = unlock( privateApis );

export default function Boolean< Item >( {
	field,
	onChange,
	onValidate,
	data,
	hideLabelFromVision,
}: DataFormControlProps< Item > ) {
	const { id, getValue, label } = field;
	const value = getValue( { item: data } );
	const [ customValidity, setCustomValidity ] =
		useState<
			React.ComponentProps<
				typeof ValidatedToggleControl
			>[ 'customValidity' ]
		>( undefined );

	// onValidate needs access to the latest value that has been validated
	// to bail early if it didn't change.
	//
	// We can't use the value directly because it is updated by onChange,
	// and so there may be race conditions between onChange and onValidate.
	const previousValidatedValueRef = useRef< unknown >( value );

	return (
		<ValidatedToggleControl
			required={ !! field.isValid.required }
			onValidate={ ( newValue: any ) => {
				// Do not trigger validation if the value is the same as before.
				if ( newValue === previousValidatedValueRef.current ) {
					return;
				}
				previousValidatedValueRef.current = newValue;

				const message = field.isValid?.custom?.(
					{
						...data,
						[ id ]: newValue,
					},
					field
				);

				// Async validation:
				// validity can be validating, invalid, valid.
				if ( message instanceof Promise ) {
					setCustomValidity( {
						type: 'validating',
						message: 'Validating...',
					} );
					onValidate( {
						id: field.id,
						isValid: undefined,
						isValidating: true,
						errors: [],
					} );

					message
						.then( ( result ) => {
							if ( result ) {
								setCustomValidity( {
									type: 'invalid',
									message: result,
								} );
								onValidate( {
									id: field.id,
									isValid: false,
									isValidating: false,
									errors: [ result ],
								} );
							} else {
								setCustomValidity( {
									type: 'valid',
									message: 'Validated',
								} );
								onValidate( {
									id: field.id,
									isValid: true,
									isValidating: false,
									errors: [],
								} );
							}
						} )
						.catch( ( error ) => {
							setCustomValidity( {
								type: 'invalid',
								message: error.message,
							} );
							onValidate( {
								id: field.id,
								isValid: false,
								isValidating: false,
								errors: [ error.message ],
							} );
						} );

					return;
				}

				// Sync validation:
				// validity is either invalid or undefined (nothing displayed).
				if ( message ) {
					setCustomValidity( {
						type: 'invalid',
						message,
					} );
					onValidate( {
						id: field.id,
						isValid: false,
						isValidating: false,
						errors: [ message ],
					} );
					return;
				}

				onValidate( {
					id: field.id,
					isValid: true,
					isValidating: false,
					errors: [],
				} );
				setCustomValidity( undefined );
			} }
			customValidity={ customValidity }
			hidden={ hideLabelFromVision }
			__nextHasNoMarginBottom
			label={ label }
			checked={ value }
			onChange={ () => onChange( { [ id ]: ! value } ) }
		/>
	);
}
