/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { normalizeFields } from '../normalize-fields';
import type { Field, Form, NormalizedField } from '../types';

/**
 * Type for the return value of useIsFormValid hook.
 */
export type UseIsFormValidReturn = Record< string, string > | undefined;

/**
 * Hook that validates a form item and returns an object with error messages for each field.
 *
 * @param item   The item to validate.
 * @param fields Fields config.
 * @param form   Form config.
 *
 * @return Record of field IDs to error messages (undefined means no error).
 */
export function useIsFormValid< Item >(
	item: Item,
	fields: Field< Item >[],
	form: Form
): UseIsFormValidReturn {
	return useMemo( () => {
		if ( typeof form.fields === 'undefined' ) {
			return [];
		}

		const normalizedFields = normalizeFields(
			fields.filter( ( field ) => {
				return form?.fields?.some( ( formField ) => {
					if ( typeof formField === 'string' ) {
						return formField === field.id;
					}
					return formField.id === field.id;
				} );
			} )
		);

		return getFieldErrors( item, normalizedFields );
	}, [ item, fields, form ] );
}

/**
 * Helper function to get error messages for all fields.
 *
 * @param item   The item to validate.
 * @param fields Normalized fields.
 *
 * @return Record of field IDs to error messages.
 */
function getFieldErrors< Item >(
	item: Item,
	fields: NormalizedField< Item >[]
): UseIsFormValidReturn {
	const errors: Record< string, string > = {};

	fields.forEach( ( field ) => {
		const value = field.getValue( { item } );

		// Check required field validation
		if ( field.isValid.required ) {
			const isEmptyNullOrUndefined = [ undefined, '', null ].includes(
				value
			);

			if (
				( field.type === 'text' && isEmptyNullOrUndefined ) ||
				( field.type === 'email' && isEmptyNullOrUndefined ) ||
				( field.type === 'integer' && isEmptyNullOrUndefined ) ||
				( field.type === undefined && isEmptyNullOrUndefined )
			) {
				errors[ field.id ] = `${ field.label } is required.`;
				return;
			}

			if ( field.type === 'boolean' && value !== true ) {
				errors[ field.id ] = `${ field.label } must be checked.`;
				return;
			}
		}

		// Check custom validation
		if ( typeof field.isValid.custom === 'function' ) {
			const customError = field.isValid.custom( item, field );
			if ( customError !== null ) {
				errors[ field.id ] = customError;
			}
		}

		// No errors for this field - don't add to errors object
	} );

	return Object.keys( errors ).length > 0 ? errors : undefined;
}

export default useIsFormValid;
