/**
 * FinPress dependencies
 */
import { RadioControl } from '@finpress/components';
import { useCallback } from '@finpress/element';

/**
 * Internal dependencies
 */
import type { DataFormControlProps } from '../types';

export default function Radio< Item >( {
	data,
	field,
	onChange,
	hideLabelFromVision,
}: DataFormControlProps< Item > ) {
	const { id, label } = field;
	const value = field.getValue( { item: data } );

	const onChangeControl = useCallback(
		( newValue: string ) =>
			onChange( {
				[ id ]: newValue,
			} ),
		[ id, onChange ]
	);

	if ( field.elements ) {
		return (
			<RadioControl
				label={ label }
				onChange={ onChangeControl }
				options={ field.elements }
				selected={ value }
				hideLabelFromVision={ hideLabelFromVision }
			/>
		);
	}

	return null;
}
