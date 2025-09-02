/**
 * WordPress dependencies
 */
import { forwardRef, useRef, useCallback, useEffect } from '@wordpress/element';
import { useMergeRefs } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { ControlWithError } from '../control-with-error';
import type { ValidatedControlProps } from './types';
import { FormTokenField } from '../../form-token-field';
import type { FormTokenFieldProps } from '../../form-token-field/types';

type Value = FormTokenFieldProps[ 'value' ];

const UnforwardedValidatedFormTokenField = (
	{
		required,
		onValidate,
		customValidity,
		onChange,
		markWhenOptional,
		...restProps
	}: Omit<
		React.ComponentProps< typeof FormTokenField >,
		'__next40pxDefaultSize' | '__nextHasNoMarginBottom'
	> &
		ValidatedControlProps< FormTokenFieldProps[ 'value' ] >,
	forwardedRef: React.ForwardedRef< HTMLInputElement >
) => {
	const validityTargetRef = useRef< HTMLInputElement >( null );
	const mergedRefs = useMergeRefs( [ forwardedRef, validityTargetRef ] );
	const valueRef = useRef< Value >( restProps.value );

	const validateField = useCallback( () => {
		// Custom validation for FormTokenField:
		// For required fields, we need to check if there are tokens present,
		// not just if the input has content (since the input is usually empty).
		if ( required ) {
			const hasTokens = valueRef.current && valueRef.current.length > 0;
			const input = validityTargetRef.current;

			if ( ! input ) {
				return;
			}

			if ( ! hasTokens ) {
				input.setCustomValidity( 'Please add at least one item.' );
			} else {
				input.setCustomValidity( '' );
			}
		}

		// Call the original validation callback if provided
		return onValidate?.( valueRef.current );
	}, [ required, onValidate ] );

	// Ensure the input element never has the required attribute set
	// This prevents native HTML5 validation from interfering
	useEffect( () => {
		const input = validityTargetRef.current;
		if ( input ) {
			input.removeAttribute( 'required' );
			input.required = false;

			// Also ensure custom validity is properly set based on current state
			if ( required ) {
				const hasTokens =
					valueRef.current && valueRef.current.length > 0;
				if ( hasTokens ) {
					input.setCustomValidity( '' );
				} else {
					input.setCustomValidity( 'Please add at least one item.' );
				}
			}
		}
	} );

	return (
		<ControlWithError
			required={ required }
			markWhenOptional={ markWhenOptional }
			onValidate={ validateField }
			customValidity={ customValidity }
			getValidityTarget={ () => validityTargetRef.current }
		>
			<FormTokenField
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				ref={ mergedRefs }
				{ ...restProps }
				// Don't pass required to FormTokenField to avoid HTML5 validation conflict
				// We handle all validation through our custom logic
				// This must come after restProps to override any required prop
				required={ false }
				onChange={ ( value, ...args ) => {
					valueRef.current = value;
					onChange?.( value, ...args );
				} }
				{ ...restProps }
			/>
		</ControlWithError>
	);
};

export const ValidatedFormTokenField = forwardRef(
	UnforwardedValidatedFormTokenField
);
