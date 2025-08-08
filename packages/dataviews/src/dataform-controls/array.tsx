/**
 * WordPress dependencies
 */
import { FormTokenField } from '@wordpress/components';
import { useCallback, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { DataFormControlProps } from '../types';

export default function ArrayControl< Item >( {
	data,
	field,
	onChange,
	hideLabelFromVision,
}: DataFormControlProps< Item > ) {
	const { id, label, placeholder, elements, ...extraProps } = field;
	const value = field.getValue( { item: data } );
	const findSuggestionByValue = useCallback(
		( suggestionValue: string ) => {
			return elements?.find(
				( suggestion ) => suggestion.value === suggestionValue
			);
		},
		[ elements ]
	);

	const findSuggestionByLabel = useCallback(
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
				? value
						.map( ( v ) => findSuggestionByValue( v )?.label )
						.filter(
							( item ): item is string => item !== undefined
						)
				: [],
		[ value, findSuggestionByValue ]
	);

	const onChangeControl = useCallback(
		( tokens: ( string | { value: string } )[] ) => {
			// Convert TokenItem objects to strings
			const stringTokens = tokens.map( ( token ) =>
				typeof token === 'string'
					? findSuggestionByLabel( token )?.value
					: token.value
			);
			onChange( {
				[ id ]: stringTokens,
			} );
		},
		[ id, onChange, findSuggestionByLabel ]
	);

	// Custom validation function for FormTokenField
	const validateInput = useCallback(
		( token: string ) => {
			if ( field.isValid?.custom ) {
				const testValue = [ ...arrayValue, token ];
				const validationResult = field.isValid.custom(
					{
						...data,
						[ id ]: testValue,
					},
					field
				);
				return validationResult === null;
			}
			return true;
		},
		[ field, data, id, arrayValue ]
	);

	return (
		<FormTokenField
			label={ hideLabelFromVision ? undefined : label }
			value={ arrayValue }
			onChange={ onChangeControl }
			placeholder={ placeholder }
			suggestions={
				elements?.map( ( suggestion ) => suggestion.label ) ?? []
			}
			__experimentalValidateInput={ validateInput }
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			{ ...extraProps }
		/>
	);
}
