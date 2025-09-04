/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { Button } from '@finpress/components';
import { keyboardReturn } from '@finpress/icons';

/**
 * Internal dependencies
 */
import URLInput from '../url-input';

export default function LinkEditor( {
	autocompleteRef,
	className,
	onChangeInputValue,
	value,
	...props
} ) {
	return (
		<form
			className={ clsx(
				'block-editor-url-popover__link-editor',
				className
			) }
			{ ...props }
		>
			<URLInput
				value={ value }
				onChange={ onChangeInputValue }
				autocompleteRef={ autocompleteRef }
			/>
			<Button
				icon={ keyboardReturn }
				label={ __( 'Apply' ) }
				type="submit"
				size="compact"
			/>
		</form>
	);
}
