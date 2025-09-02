/**
 * WordPress dependencies
 */
import { useMemo, useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { DataFormProps, ValidationError } from '../../types';
import { DataFormProvider } from '../dataform-context';
import { normalizeFields } from '../../normalize-fields';
import { DataFormLayout } from '../../dataforms-layouts/data-form-layout';

export default function DataForm< Item >( {
	data,
	form,
	fields,
	onChange,
	onValidate,
}: DataFormProps< Item > ) {
	const normalizedFields = useMemo(
		() => normalizeFields( fields ),
		[ fields ]
	);

	const [ isFormValid, setIsFormValid ] = useState< boolean | undefined >();
	const [ validating, setValidating ] = useState< string[] >( [] );
	const [ formErrors, setFormErrors ] = useState< ValidationError[] >( [] );

	const onValidateCb = useCallback(
		( {
			id,
			isValid,
			isValidating,
			errors,
		}: {
			id: string;
			isValid: boolean | undefined;
			isValidating: boolean;
			errors: string[];
		} ) => {
			if ( ! onValidate ) {
				return;
			}

			// Process errors.
			const newFormErrors = [
				...formErrors.filter( ( error ) => error.id !== id ),
				...errors.map( ( error ) => ( {
					id,
					message: error,
				} ) ),
			];

			// Process isValidating.
			const newValidating = isValidating
				? [ ...validating, id ]
				: validating.filter( ( v ) => v !== id );

			// Process isValid.
			let newIsValid = isFormValid;
			if ( isValid === false ) {
				newIsValid = false;
			}
			if ( newFormErrors.length === 0 && newValidating.length === 0 ) {
				newIsValid = true;
			}

			setIsFormValid( newIsValid );
			setValidating( newValidating );
			setFormErrors( newFormErrors );
			onValidate( {
				isValid: newIsValid,
				isValidating: newValidating.length > 0,
				errors: newFormErrors,
			} );
		},
		[ onValidate, formErrors, validating, isFormValid ]
	);

	if ( ! form.fields ) {
		return null;
	}

	return (
		<DataFormProvider fields={ normalizedFields }>
			<DataFormLayout
				data={ data }
				form={ form }
				onChange={ onChange }
				onValidate={ onValidateCb }
			/>
		</DataFormProvider>
	);
}
