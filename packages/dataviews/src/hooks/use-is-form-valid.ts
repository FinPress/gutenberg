/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { normalizeFields } from '../normalize-fields';
import type { Field, Form, FormValidity } from '../types';

/**
 * Type for the return value of useIsFormValid hook.
 */

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
): FormValidity {
	const [ formValidity, setFormValidity ] = useState< FormValidity >();

	const previousValidatedValuesRef = useRef< Record< string, any > >( {} );

	const validate = useCallback( () => {
		if ( typeof form.fields === 'undefined' ) {
			setFormValidity( undefined );
			return;
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

		normalizedFields.forEach( ( field ) => {
			const value = field.getValue( { item } );

			if ( value === previousValidatedValuesRef.current[ field.id ] ) {
				return;
			}
			previousValidatedValuesRef.current[ field.id ] = value;

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
					setFormValidity( ( prev ) => [
						...( prev
							? prev.filter(
									( fieldValidation ) =>
										fieldValidation.id !== field.id
							  )
							: [] ),
						{
							id: field.id,
							required: 'invalid',
						},
					] );
					return;
				}

				if ( field.type === 'boolean' && value !== true ) {
					setFormValidity( ( prev ) => [
						...( prev
							? prev.filter(
									( fieldValidation ) =>
										fieldValidation.id !== field.id
							  )
							: [] ),
						{
							id: field.id,
							required: 'invalid',
						},
					] );
					return;
				}
			}

			// Check if the custom validation function is async
			if (
				typeof field.isValid.custom === 'function' &&
				field.isValid.custom.constructor.name === 'AsyncFunction'
			) {
				const customAsyncError = field.isValid.custom( item, field );
				if ( customAsyncError === null ) {
					return;
				}

				setFormValidity( ( prev ) => [
					...( prev
						? prev.filter(
								( fieldValidation ) =>
									fieldValidation.id !== field.id
						  )
						: [] ),
					{
						id: field.id,
						custom: {
							type: 'validating',
							message: 'Validating...',
						},
					},
				] );

				if ( customAsyncError instanceof Promise ) {
					customAsyncError
						.then( ( result ) => {
							if ( result === null ) {
								setFormValidity( ( prev ) => [
									...( prev
										? prev.filter(
												( fieldValidation ) =>
													fieldValidation.id !==
													field.id
										  )
										: [] ),
									{
										id: field.id,
										custom: {
											type: 'valid',
											message: 'Valid',
										},
									},
								] );
							}

							if ( typeof result === 'string' ) {
								setFormValidity( ( prev ) => [
									...( prev
										? prev.filter(
												( fieldValidation ) =>
													fieldValidation.id !==
													field.id
										  )
										: [] ),
									{
										id: field.id,
										custom: {
											type: 'invalid',
											message: result,
										},
									},
								] );
							}
						} )
						.catch( ( error ) => {
							setFormValidity( ( prev ) => [
								...( prev
									? prev.filter(
											( fieldValidation ) =>
												fieldValidation.id !== field.id
									  )
									: [] ),
								{
									id: field.id,
									custom: {
										type: 'invalid',
										message: error.message,
									},
								},
							] );
						} );
				}

				return;
			}

			// Check custom validation
			if (
				typeof field.isValid.custom === 'function' &&
				! ( field.isValid.custom.constructor.name === 'AsyncFunction' )
			) {
				const customError = field.isValid.custom( item, field );
				if ( typeof customError === 'string' ) {
					setFormValidity( ( prev ) => [
						...( prev
							? prev.filter( ( error ) => error.id !== field.id )
							: [] ),
						{
							id: field.id,
							custom: {
								type: 'invalid',
								message: customError,
							},
						},
					] );
					return;
				}
			}

			// No errors for this field, remove from errors object
			setFormValidity( ( prev ) => {
				const errors = [
					...( prev ? prev : [] ).filter(
						( error ) => error.id !== field.id
					),
				];

				if ( errors.length === 0 ) {
					return undefined;
				}

				return errors;
			} );
		} );
	}, [ item, fields, form ] );

	useEffect( () => {
		validate();
	}, [ validate ] );

	return formValidity;
}

export default useIsFormValid;
