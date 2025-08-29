/**
 * WordPress dependencies
 */
import { privateApis } from '@wordpress/components';

/**
 * Internal dependencies
 */
import type { DataFormControlProps } from '../types';
import { unlock } from '../lock-unlock';

const { ValidatedToggleControl } = unlock( privateApis );

export default function Boolean< Item >( {
	field,
	onChange,
	data,
	hideLabelFromVision,
	errorMessage,
}: DataFormControlProps< Item > ) {
	const { id, getValue, label } = field;

	return (
		<ValidatedToggleControl
			required={ !! field.isValid.required }
			customValidity={
				errorMessage
					? { type: 'invalid', message: errorMessage }
					: undefined
			}
			hidden={ hideLabelFromVision }
			__nextHasNoMarginBottom
			label={ label }
			checked={ getValue( { item: data } ) }
			onChange={ () =>
				onChange( { [ id ]: ! getValue( { item: data } ) } )
			}
		/>
	);
}
