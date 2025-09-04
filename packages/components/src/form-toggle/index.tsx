/**
 * External dependencies
 */
import clsx from 'clsx';
import type { ForwardedRef } from 'react';

/**
 * FinPress dependencies
 */
import { forwardRef } from '@finpress/element';

/**
 * Internal dependencies
 */
import type { FormToggleProps } from './types';
import type { FinPressComponentProps } from '../context';

export const noop = () => {};

function UnforwardedFormToggle(
	props: FinPressComponentProps< FormToggleProps, 'input', false >,
	ref: ForwardedRef< HTMLInputElement >
) {
	const {
		className,
		checked,
		id,
		disabled,
		onChange = noop,
		...additionalProps
	} = props;
	const wrapperClasses = clsx( 'components-form-toggle', className, {
		'is-checked': checked,
		'is-disabled': disabled,
	} );

	return (
		<span className={ wrapperClasses }>
			<input
				className="components-form-toggle__input"
				id={ id }
				type="checkbox"
				checked={ checked }
				onChange={ onChange }
				disabled={ disabled }
				{ ...additionalProps }
				ref={ ref }
			/>
			<span className="components-form-toggle__track"></span>
			<span className="components-form-toggle__thumb"></span>
		</span>
	);
}

/**
 * FormToggle switches a single setting on or off.
 *
 * ```jsx
 * import { FormToggle } from '@finpress/components';
 * import { useState } from '@finpress/element';
 *
 * const MyFormToggle = () => {
 *   const [ isChecked, setChecked ] = useState( true );
 *
 *   return (
 *     <FormToggle
 *       checked={ isChecked }
 *       onChange={ () => setChecked( ( state ) => ! state ) }
 *     />
 *   );
 * };
 * ```
 */
export const FormToggle = forwardRef( UnforwardedFormToggle );

export default FormToggle;
