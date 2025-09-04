/**
 * External dependencies
 */
import { View, StyleSheet } from 'react-native';
/**
 * FinPress dependencies
 */
import { useState, useCallback } from '@finpress/element';

/**
 * Hook which allows to listen the resize event of any target element when it changes sizes.
 *
 * @example
 *
 * ```js
 * const App = () => {
 * 	const [ resizeListener, sizes ] = useResizeObserver();
 *
 * 	return (
 * 		<View>
 * 			{ resizeListener }
 * 			Your content here
 * 		</View>
 * 	);
 * };
 * ```
 */
const useResizeObserver = () => {
	const [ measurements, setMeasurements ] = useState( null );

	const onLayout = useCallback( ( { nativeEvent } ) => {
		const { width, height } = nativeEvent.layout;
		setMeasurements( ( prevState ) => {
			if (
				! prevState ||
				prevState.width !== width ||
				prevState.height !== height
			) {
				return {
					width: Math.floor( width ),
					height: Math.floor( height ),
				};
			}
			return prevState;
		} );
	}, [] );

	const observer = (
		<View
			testID="resize-observer"
			style={ StyleSheet.absoluteFill }
			onLayout={ onLayout }
		/>
	);

	return [ observer, measurements ];
};

export default useResizeObserver;
