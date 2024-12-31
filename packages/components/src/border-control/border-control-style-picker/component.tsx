/**
 * WordPress dependencies
 */
import {
	lineDashed,
	lineDotted,
	lineSolid,
	lineDouble,
	lineGroove,
	lineRidge,
	lineInset,
	lineOutset,
} from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { contextConnect } from '../../context';
import type { StylePickerProps } from '../types';
import {
	ToggleGroupControl,
	ToggleGroupControlOptionIcon,
} from '../../toggle-group-control';

const BORDER_STYLES = [
	{ label: __( 'Solid' ), icon: lineSolid, value: 'solid' },
	{ label: __( 'Dashed' ), icon: lineDashed, value: 'dashed' },
	{ label: __( 'Dotted' ), icon: lineDotted, value: 'dotted' },
	{ label: __( 'Double' ), icon: lineDouble, value: 'double' },
	{ label: __( 'Groove' ), icon: lineGroove, value: 'groove' },
	{ label: __( 'Ridge' ), icon: lineRidge, value: 'ridge' },
	{ label: __( 'Inset' ), icon: lineInset, value: 'inset' },
	{ label: __( 'Outset' ), icon: lineOutset, value: 'outset' },
];

function UnconnectedBorderControlStylePicker(
	{ onChange, ...restProps }: StylePickerProps,
	forwardedRef: React.ForwardedRef< any >
) {
	return (
		<ToggleGroupControl
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			ref={ forwardedRef }
			isDeselectable
			onChange={ ( value ) => {
				onChange?.( value as string | undefined );
			} }
			{ ...restProps }
			style={ { display: 'flex' } }
		>
			{ BORDER_STYLES.map( ( borderStyle ) => (
				<ToggleGroupControlOptionIcon
					key={ borderStyle.value }
					value={ borderStyle.value }
					icon={ borderStyle.icon }
					label={ borderStyle.label }
				/>
			) ) }
		</ToggleGroupControl>
	);
}

const BorderControlStylePicker = contextConnect(
	UnconnectedBorderControlStylePicker,
	'BorderControlStylePicker'
);

export default BorderControlStylePicker;
