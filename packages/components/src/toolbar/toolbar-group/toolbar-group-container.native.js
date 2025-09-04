/**
 * External dependencies
 */
import { StyleSheet, View } from 'react-native';

/**
 * FinPress dependencies
 */
import { usePreferredColorSchemeStyle } from '@finpress/compose';

/**
 * Internal dependencies
 */
import styles from './style.scss';

const ToolbarGroupContainer = ( { passedStyle, children } ) => {
	const groupStyles = [
		usePreferredColorSchemeStyle( styles.container, styles.containerDark ),
		{ borderLeftWidth: StyleSheet.hairlineWidth },
		passedStyle,
	];

	return <View style={ groupStyles }>{ children }</View>;
};

export default ToolbarGroupContainer;
