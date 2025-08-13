/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { error, pending, published } from '@wordpress/icons';

/**
 * External dependencies
 */
import {
	cloneElement,
	forwardRef,
	useEffect,
	useState,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import { withIgnoreIMEEvents } from '../utils/with-ignore-ime-events';
import type { ValidatedControlProps } from './components/types';

import Icon from '../icon';

function appendRequiredIndicator(
	label: React.ReactNode,
	required: boolean | undefined,
	markWhenOptional: boolean | undefined
) {
	if ( required && ! markWhenOptional ) {
		return (
			<>
				{ label } { `(${ __( 'Required' ) })` }
			</>
		);
	}
	if ( ! required && markWhenOptional ) {
		return (
			<>
				{ label } { `(${ __( 'Optional' ) })` }
			</>
		);
	}
	return label;
}

function ValidationIndicator( {
	type,
	message,
}: {
	type: 'validating' | 'valid' | 'invalid';
	message?: string;
} ) {
	const ICON = {
		validating: pending,
		valid: published,
		invalid: error,
	};
	return (
		<p
			className={ clsx(
				'components-validated-control__status',
				`is-${ type }`
			) }
		>
			<Icon
				className="components-validated-control__status-icon"
				icon={ ICON[ type ] }
				size={ 16 }
				fill="currentColor"
			/>
			{ message }
		</p>
	);
}

/**
 * HTML elements that support the Constraint Validation API.
 *
 * Here, we exclude HTMLButtonElement because although it does technically support the API,
 * normal buttons are actually exempted from any validation.
 * @see https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement/willValidate
 */
type ValidityTarget =
	| HTMLFieldSetElement
	| HTMLInputElement
	| HTMLSelectElement
	| HTMLTextAreaElement;

function UnforwardedControlWithError< C extends React.ReactElement >(
	{
		required,
		markWhenOptional,
		onValidate,
		customValidityMessage,
		getValidityTarget,
		children,
	}: {
		/**
		 * Whether the control is required.
		 */
		required?: boolean;
		/**
		 * Label the control as "optional" when _not_ `required`, instead of the inverse.
		 */
		markWhenOptional?: boolean;
		/**
		 * The callback to run when the input should be validated.
		 */
		onValidate?: () => void;
		customValidityMessage?: ValidatedControlProps< unknown >[ 'customValidityMessage' ];
		/**
		 * A function that returns the actual element on which the validity data should be applied.
		 */
		getValidityTarget: () => ValidityTarget | null | undefined;
		/**
		 * The control component to apply validation to.
		 */
		children: C;
	},
	forwardedRef: React.ForwardedRef< HTMLDivElement >
) {
	const [ errorMessage, setErrorMessage ] = useState< string | undefined >();
	const [ statusMessage, setStatusMessage ] = useState<
		| {
				type: 'validating' | 'valid';
				message?: string;
		  }
		| undefined
	>();
	const [ isTouched, setIsTouched ] = useState( false );

	// Ensure that error messages are visible after user attemps to submit a form
	// with multiple invalid fields.
	useEffect( () => {
		const validityTarget = getValidityTarget();
		const showValidationMessage = () =>
			setErrorMessage( validityTarget?.validationMessage );

		validityTarget?.addEventListener( 'invalid', showValidationMessage );

		return () => {
			validityTarget?.removeEventListener(
				'invalid',
				showValidationMessage
			);
		};
	} );

	useEffect( () => {
		if ( ! isTouched ) {
			return;
		}

		const validityTarget = getValidityTarget();

		if ( ! customValidityMessage?.type ) {
			validityTarget?.setCustomValidity( '' );
			setErrorMessage( validityTarget?.validationMessage );
			setStatusMessage( undefined );
			return;
		}

		switch ( customValidityMessage?.type ) {
			case 'validating': {
				validityTarget?.setCustomValidity( '' );
				setStatusMessage( {
					type: 'validating',
					message: customValidityMessage.message,
				} );
				break;
			}
			case 'valid': {
				validityTarget?.setCustomValidity( '' );
				setStatusMessage( {
					type: 'valid',
					message: customValidityMessage.message,
				} );
				break;
			}
			case 'invalid': {
				validityTarget?.setCustomValidity(
					customValidityMessage.message ?? ''
				);
				setStatusMessage( undefined );
				break;
			}
		}

		setErrorMessage( validityTarget?.validationMessage );
	}, [
		isTouched,
		customValidityMessage?.type,
		customValidityMessage?.message,
		getValidityTarget,
	] );

	const validate = () => {
		onValidate?.();
	};

	const onBlur = ( event: React.FocusEvent< HTMLDivElement > ) => {
		// Only consider "blurred from the component" if focus has fully left the wrapping div.
		// This prevents unnecessary blurs from components with multiple focusable elements.
		if (
			! event.relatedTarget ||
			! event.currentTarget.contains( event.relatedTarget )
		) {
			setIsTouched( true );

			const validityTarget = getValidityTarget();

			// Prevents a double flash of the native error tooltip when the control is already showing one.
			if ( ! validityTarget?.validity.valid ) {
				if ( ! errorMessage ) {
					setErrorMessage( validityTarget?.validationMessage );
				}
				return;
			}

			validate();
		}
	};

	const onChange = ( ...args: unknown[] ) => {
		children.props.onChange?.( ...args );

		// Only validate incrementally if the field has blurred at least once,
		// or currently has an error message.
		if ( isTouched || errorMessage ) {
			validate();
		}
	};

	const onKeyDown = ( event: React.KeyboardEvent< HTMLDivElement > ) => {
		// Ensures that custom validators are triggered when the user submits by pressing Enter,
		// without ever blurring the control.
		if ( event.key === 'Enter' ) {
			validate();
		}
	};

	return (
		// Disable reason: Just listening to a bubbled event, not for interaction.
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			className="components-validated-control"
			ref={ forwardedRef }
			onBlur={ onBlur }
			onKeyDown={ withIgnoreIMEEvents( onKeyDown ) }
		>
			{ cloneElement( children, {
				label: appendRequiredIndicator(
					children.props.label,
					required,
					markWhenOptional
				),
				onChange,
				required,
			} ) }
			<div aria-live="polite">
				{ errorMessage && ! statusMessage && (
					<ValidationIndicator
						type="invalid"
						message={ errorMessage }
					/>
				) }
				{ statusMessage && (
					<ValidationIndicator
						type={ statusMessage.type }
						message={ statusMessage.message }
					/>
				) }
			</div>
		</div>
	);
}

export const ControlWithError = forwardRef( UnforwardedControlWithError );
