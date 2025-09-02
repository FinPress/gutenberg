/**
 * WordPress dependencies
 */
import { privateApis } from '@wordpress/components';
import { useCallback, useState, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { DataFormControlProps } from '../types';
import { unlock } from '../lock-unlock';

const { ValidatedTextControl } = unlock( privateApis );

export default function Email< Item >( {
	data,
	field,
	onChange,
	onValidate,
	hideLabelFromVision,
}: DataFormControlProps< Item > ) {
	const { id, label, placeholder, description } = field;
	const value = field.getValue( { item: data } );
	const [ customValidity, setCustomValidity ] =
		useState<
			React.ComponentProps<
				typeof ValidatedTextControl
			>[ 'customValidity' ]
		>( undefined );

	const onChangeControl = useCallback(
		( newValue: string ) =>
			onChange( {
				[ id ]: newValue,
			} ),
		[ id, onChange ]
	);

	// onValidate needs access to the latest value that has been validated
	// to bail early if it didn't change.
	//
	// We can't use the value directly because it is updated by onChange,
	// and so there may be race conditions between onChange and onValidate.
	const previousValidatedValueRef = useRef< unknown >( value );

	return (
		<ValidatedTextControl
			required={ !! field.isValid?.required }
			onValidate={ ( newValue: any ) => {
				// Do not trigger validation if the value is the same as before.
				if ( newValue === previousValidatedValueRef.current ) {
					return;
				}
				previousValidatedValueRef.current = newValue;

				const message = field?.isValid?.custom?.(
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
			type="email"
			label={ label }
			placeholder={ placeholder }
			value={ value ?? '' }
			help={ description }
			onChange={ onChangeControl }
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			hideLabelFromVision={ hideLabelFromVision }
		/>
	);
}
