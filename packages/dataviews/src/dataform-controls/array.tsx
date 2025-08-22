/**
 * WordPress dependencies
 */
import { useCallback, useMemo, useRef, useState } from '@wordpress/element';
import { FormTokenField } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { DataFormControlProps } from '../types';

// Create a validated FormTokenField wrapper
const ValidatedFormTokenControl = ( {
	required,
	customValidator,
	onChange,
	markWhenOptional,
	label,
	...restProps
}: React.ComponentProps< typeof FormTokenField > & {
	required?: boolean;
	customValidator?: ( value: any ) => string | void;
	markWhenOptional?: boolean;
} ) => {
	const [ errorMessage, setErrorMessage ] = useState< string | undefined >();
	const [ isTouched, setIsTouched ] = useState( false );
	const valueRef = useRef( restProps.value );

	const validate = useCallback( () => {
		if (
			required &&
			( ! valueRef.current || valueRef.current.length === 0 )
		) {
			setErrorMessage( __( 'This field is required.' ) );
			return;
		}

		const customError = customValidator?.( valueRef.current );
		setErrorMessage( customError || undefined );
	}, [ required, customValidator ] );

	const onBlur = useCallback( () => {
		setIsTouched( true );
		validate();
	}, [ validate ] );

	const onChangeControl = useCallback(
		( value: any ) => {
			valueRef.current = value;
			onChange?.( value );

			// Only validate incrementally if the field has been touched or currently has an error
			if ( isTouched || errorMessage ) {
				validate();
			}
		},
		[ onChange, isTouched, errorMessage, validate ]
	);

	// Append required indicator to label
	const labelWithIndicator = useMemo( () => {
		if ( required && ! markWhenOptional ) {
			return `${ label } (${ __( 'Required' ) })`;
		}
		if ( ! required && markWhenOptional ) {
			return `${ label } (${ __( 'Optional' ) })`;
		}
		return label;
	}, [ label, required, markWhenOptional ] );

	return (
		<div className="components-validated-control" onBlur={ onBlur }>
			<FormTokenField
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				{ ...restProps }
				label={ labelWithIndicator }
				onChange={ onChangeControl }
			/>
			<div aria-live="polite">
				{ errorMessage && (
					<p className="components-validated-control__error">
						{ errorMessage }
					</p>
				) }
			</div>
		</div>
	);
};

export default function ArrayControl< Item >( {
	data,
	field,
	onChange,
	hideLabelFromVision,
}: DataFormControlProps< Item > ) {
	const { id, label, placeholder, elements } = field;
	const value = field.getValue( { item: data } );

	const findElementByValue = useCallback(
		( suggestionValue: string ) => {
			return elements?.find(
				( suggestion ) => suggestion.value === suggestionValue
			);
		},
		[ elements ]
	);

	const findElementByLabel = useCallback(
		( suggestionLabel: string ) => {
			return elements?.find(
				( suggestion ) => suggestion.label === suggestionLabel
			);
		},
		[ elements ]
	);

	// Convert values to labels for display purposes only
	const arrayValueForDisplay = useMemo(
		() =>
			Array.isArray( value )
				? value.map( ( token ) => {
						const tokenLabel = findElementByValue( token )?.label;
						return tokenLabel || token;
				  } )
				: [],
		[ value, findElementByValue ]
	);

	const onChangeControl = useCallback(
		( tokens: ( string | { value: string } )[] ) => {
			// Convert display labels back to values for storage
			const valueTokens = tokens.map( ( token ) => {
				if ( typeof token !== 'string' ) {
					return token.value;
				}

				// If user entered a label, convert it to its corresponding value
				const elementByLabel = findElementByLabel( token );
				if ( elementByLabel ) {
					return elementByLabel.value;
				}

				// If no matching element found, treat it as a direct value
				// This handles cases where user types values directly or when elements aren't defined
				return token;
			} );

			onChange( {
				[ id ]: valueTokens,
			} );
		},
		[ id, onChange, findElementByLabel ]
	);

	return (
		<ValidatedFormTokenControl
			required={ !! field.isValid?.required }
			customValidator={ ( displayLabels: any ) => {
				if ( field.isValid?.custom ) {
					// Convert display labels back to values for validation
					const actualValues = Array.isArray( displayLabels )
						? displayLabels.map( ( displayLabel ) => {
								const elementByLabel =
									findElementByLabel( displayLabel );
								return elementByLabel?.value || displayLabel;
						  } )
						: displayLabels;

					const result = field.isValid.custom(
						{
							...data,
							[ id ]: actualValues,
						},
						field
					);
					return result || undefined;
				}

				return undefined;
			} }
			label={ hideLabelFromVision ? undefined : label }
			value={ arrayValueForDisplay }
			onChange={ onChangeControl }
			placeholder={ placeholder }
			suggestions={
				elements?.map( ( suggestion ) => suggestion.label ) ?? []
			}
			__experimentalValidateInput={ ( token ) => {
				if ( ! field.isValid?.elements ) {
					return true;
				}

				// Check if the token matches any of the available elements
				const tokenByLabel = findElementByLabel( token );
				return !! tokenByLabel;
			} }
			__experimentalExpandOnFocus={ elements && elements.length > 0 }
			__experimentalShowHowTo={ ! field.isValid?.elements }
		/>
	);
}
