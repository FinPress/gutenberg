/**
 * WordPress dependencies
 */
import { useCallback, useMemo, useRef, useState } from '@wordpress/element';
import { FormTokenField } from '@wordpress/components';

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
			setErrorMessage( 'This field is required.' );
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
			return `${ label } (Required)`;
		}
		if ( ! required && markWhenOptional ) {
			return `${ label } (Optional)`;
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

	// Ensure value is an array
	const arrayValue = useMemo(
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
			// Convert TokenItem objects to strings
			const stringTokens = tokens.map( ( token ) => {
				if ( typeof token !== 'string' ) {
					return token.value;
				}

				const tokenByLabel = findElementByLabel( token );

				return tokenByLabel?.value || token;
			} );

			onChange( {
				[ id ]: stringTokens,
			} );
		},
		[ id, onChange, findElementByLabel ]
	);

	return (
		<ValidatedFormTokenControl
			required={ !! field.isValid?.required }
			customValidator={ ( newValue: any ) => {
				if ( field.isValid?.custom ) {
					const result = field.isValid.custom(
						{
							...data,
							[ id ]: newValue,
						},
						field
					);
					return result || undefined;
				}

				return undefined;
			} }
			label={ hideLabelFromVision ? undefined : label }
			value={ arrayValue }
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
