/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { useInstanceId } from '@finpress/compose';
import { forwardRef } from '@finpress/element';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import { StyledTextarea } from './styles/textarea-control-styles';
import type { TextareaControlProps } from './types';
import type { FinPressComponentProps } from '../context';

function UnforwardedTextareaControl(
	props: FinPressComponentProps< TextareaControlProps, 'textarea', false >,
	ref: React.ForwardedRef< HTMLTextAreaElement >
) {
	const {
		__nextHasNoMarginBottom,
		label,
		hideLabelFromVision,
		value,
		help,
		onChange,
		rows = 4,
		className,
		...additionalProps
	} = props;
	const instanceId = useInstanceId( TextareaControl );
	const id = `inspector-textarea-control-${ instanceId }`;
	const onChangeValue = ( event: React.ChangeEvent< HTMLTextAreaElement > ) =>
		onChange( event.target.value );

	const classes = clsx( 'components-textarea-control', className );

	return (
		<BaseControl
			__nextHasNoMarginBottom={ __nextHasNoMarginBottom }
			__associatedFPComponentName="TextareaControl"
			label={ label }
			hideLabelFromVision={ hideLabelFromVision }
			id={ id }
			help={ help }
			className={ classes }
		>
			<StyledTextarea
				className="components-textarea-control__input"
				id={ id }
				rows={ rows }
				onChange={ onChangeValue }
				aria-describedby={ !! help ? id + '__help' : undefined }
				value={ value }
				ref={ ref }
				{ ...additionalProps }
			/>
		</BaseControl>
	);
}

/**
 * TextareaControls are TextControls that allow for multiple lines of text, and
 * wrap overflow text onto a new line. They are a fixed height and scroll
 * vertically when the cursor reaches the bottom of the field.
 *
 * ```jsx
 * import { TextareaControl } from '@finpress/components';
 * import { useState } from '@finpress/element';
 *
 * const MyTextareaControl = () => {
 *   const [ text, setText ] = useState( '' );
 *
 *   return (
 *     <TextareaControl
 *       __nextHasNoMarginBottom
 *       label="Text"
 *       help="Enter some text"
 *       value={ text }
 *       onChange={ ( value ) => setText( value ) }
 *     />
 *   );
 * };
 * ```
 */
export const TextareaControl = forwardRef( UnforwardedTextareaControl );

export default TextareaControl;
