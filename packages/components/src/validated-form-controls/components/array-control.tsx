/**
 * WordPress dependencies
 */
import { forwardRef, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { ControlWithError } from '../control-with-error';
import type { ValidatedControlProps } from './types';
import { FormTokenField } from '../../form-token-field';
import type { FormTokenFieldProps } from '../../form-token-field/types';

type Value = FormTokenFieldProps[ 'value' ];

const UnforwardedValidatedArrayControl = (
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
	forwardedRef: React.ForwardedRef< HTMLDivElement >
) => {
	const valueRef = useRef< Value >( restProps.value );
	const formTokenFieldRef = useRef< HTMLDivElement >( null );

	// Create a function to find the input element within the FormTokenField
	const getInputElement = () => {
		return formTokenFieldRef.current?.querySelector(
			'.components-form-token-field__input'
		) as HTMLInputElement | null;
	};

	return (
		<ControlWithError
			ref={ forwardedRef }
			required={ required }
			markWhenOptional={ markWhenOptional }
			onValidate={ () => {
				return onValidate?.( valueRef.current );
			} }
			customValidity={ customValidity }
			getValidityTarget={ getInputElement }
		>
			<div ref={ formTokenFieldRef }>
				<FormTokenField
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					onChange={ ( value, ...args ) => {
						valueRef.current = value;
						onChange?.( value, ...args );
					} }
					{ ...restProps }
				/>
			</div>
		</ControlWithError>
	);
};

export const ValidatedArrayControl = forwardRef(
	UnforwardedValidatedArrayControl
);
