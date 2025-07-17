/**
 * External dependencies
 */
import { colord } from 'colord';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { InputControl } from '../input-control';
import { Text } from '../text';
import { COLORS } from '../utils/colors-values';
import type { StateReducer } from '../input-control/reducer/state';
import type { HexInputProps } from './types';
import InputControlPrefixWrapper from '../input-control/input-prefix-wrapper';

function isValidHexInput( hexValue: string, enableAlpha: boolean ): boolean {
	const hex = hexValue.slice( 1 );

	if ( hex.length === 0 ) {
		return true;
	}

	const validHexChars = /^[0-9a-fA-F]*$/;
	if ( ! validHexChars.test( hex ) ) {
		return false;
	}

	const maxLength = enableAlpha ? 8 : 6;
	if ( hex.length > maxLength ) {
		return false;
	}

	return true;
}

function normalizeHexValue(
	hexValue: string,
	enableAlpha: boolean
): string | null {
	const hex = hexValue.slice( 1 );

	if ( hex.length === 3 ) {
		return (
			'#' +
			hex
				.split( '' )
				.map( ( char ) => char + char )
				.join( '' )
		);
	} else if ( hex.length === 4 && enableAlpha ) {
		return (
			'#' +
			hex
				.split( '' )
				.map( ( char ) => char + char )
				.join( '' )
		);
	} else if ( hex.length === 6 ) {
		return hexValue;
	} else if ( hex.length === 8 && enableAlpha ) {
		return hexValue;
	}

	return null;
}

export const HexInput = ( { color, onChange, enableAlpha }: HexInputProps ) => {
	const colorHex = useMemo(
		() => color.toHex().slice( 1 ).toUpperCase(),
		[ color ]
	);
	const [ inputValue, setInputValue ] = useState( colorHex );

	useEffect( () => {
		const normalizedInput = normalizeHexValue(
			'#' + inputValue,
			enableAlpha
		);
		const normalizedColor = normalizeHexValue(
			'#' + colorHex,
			enableAlpha
		);

		if ( normalizedInput !== normalizedColor ) {
			setInputValue( colorHex );
		}
	}, [ colorHex, inputValue, enableAlpha ] );

	const handleChange = ( nextValue: string | undefined ) => {
		if ( nextValue === undefined ) {
			return;
		}

		const filteredValue = nextValue
			.replace( /[^0-9a-fA-F]/g, '' )
			.toUpperCase();
		setInputValue( filteredValue );

		const hexValue = '#' + filteredValue;

		if ( isValidHexInput( hexValue, enableAlpha ) ) {
			try {
				const normalizedHex = normalizeHexValue(
					hexValue,
					enableAlpha
				);
				if ( normalizedHex ) {
					onChange( colord( normalizedHex ) );
				}
			} catch ( error ) {
				// Silently ignore invalid color values during typing
			}
		}
	};

	const stateReducer: StateReducer = ( state, action ) => {
		const nativeEvent = action.payload?.event?.nativeEvent as InputEvent;

		if ( 'insertFromPaste' !== nativeEvent?.inputType ) {
			return { ...state };
		}

		let value = state.value || '';
		if ( value.startsWith( '#' ) ) {
			value = value.slice( 1 );
		}

		value = value.replace( /[^0-9a-fA-F]/g, '' ).toUpperCase();

		return { ...state, value };
	};

	return (
		<InputControl
			prefix={
				<InputControlPrefixWrapper>
					<Text color={ COLORS.theme.accent } lineHeight={ 1 }>
						#
					</Text>
				</InputControlPrefixWrapper>
			}
			value={ inputValue }
			onChange={ handleChange }
			maxLength={ enableAlpha ? 8 : 6 }
			label={ __( 'Hex color' ) }
			hideLabelFromVision
			size="__unstable-large"
			__unstableStateReducer={ stateReducer }
			__unstableInputWidth="9em"
		/>
	);
};
