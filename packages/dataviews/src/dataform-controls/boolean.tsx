/**
 * WordPress dependencies
 */
import { privateApis } from '@wordpress/components';
import { useState } from '@wordpress/element';

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
}: DataFormControlProps< Item > ) {
	const { id, getValue, label } = field;
	const [ customValidityMessage, setCustomValidityMessage ] =
		useState<
			React.ComponentProps<
				typeof ValidatedToggleControl
			>[ 'customValidityMessage' ]
		>( undefined );

	return (
		<ValidatedToggleControl
			required={ !! field.isValid.required }
			onValidate={ ( newValue: any ) => {
				const message = field.isValid?.custom?.(
					{
						...data,
						[ id ]: newValue,
					},
					field
				);

				if ( message ) {
					setCustomValidityMessage( {
						type: 'invalid',
						message,
					} );
					return;
				}

				setCustomValidityMessage( undefined );
			} }
			customValidityMessage={ customValidityMessage }
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
