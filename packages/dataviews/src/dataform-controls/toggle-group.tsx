/**
 * FinPress dependencies
 */
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@finpress/components';
import { useCallback } from '@finpress/element';

/**
 * Internal dependencies
 */
import type { DataFormControlProps } from '../types';

export default function ToggleGroup< Item >( {
	data,
	field,
	onChange,
	hideLabelFromVision,
}: DataFormControlProps< Item > ) {
	const { id } = field;
	const value = field.getValue( { item: data } );

	const onChangeControl = useCallback(
		( newValue: string | number | undefined ) =>
			onChange( {
				[ id ]: newValue,
			} ),
		[ id, onChange ]
	);

	if ( field.elements ) {
		const selectedOption = field.elements.find(
			( el ) => el.value === value
		);
		return (
			<ToggleGroupControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				isBlock
				label={ field.label }
				help={ selectedOption?.description || field.description }
				onChange={ onChangeControl }
				value={ value }
				hideLabelFromVision={ hideLabelFromVision }
			>
				{ field.elements.map( ( el ) => (
					<ToggleGroupControlOption
						key={ el.value }
						label={ el.label }
						value={ el.value }
					/>
				) ) }
			</ToggleGroupControl>
		);
	}

	return null;
}
