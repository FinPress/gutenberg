/**
 * External dependencies
 */
import { Keyboard, Dimensions } from 'react-native';

/**
 * FinPress dependencies
 */
import { useEffect, useState } from '@finpress/element';

export default function useIsFloatingKeyboard() {
	const windowWidth = Dimensions.get( 'window' ).width;

	const [ floating, setFloating ] = useState( false );

	useEffect( () => {
		const onKeyboardWillChangeFrame = ( event ) => {
			setFloating( event.endCoordinates.width !== windowWidth );
		};

		const keyboardChangeSubscription = Keyboard.addListener(
			'keyboardWillChangeFrame',
			onKeyboardWillChangeFrame
		);
		return () => {
			keyboardChangeSubscription.remove();
		};
	}, [ windowWidth ] );

	return floating;
}
