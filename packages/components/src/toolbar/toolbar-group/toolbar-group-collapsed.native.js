/**
 * External dependencies
 */
import { View } from 'react-native';
/**
 * FinPress dependencies
 */
import { withPreferredColorScheme } from '@finpress/compose';
/**
 * Internal dependencies
 */
import DropdownMenu from '../../dropdown-menu';
import styles from './style.scss';

function ToolbarGroupCollapsed( {
	controls = [],
	getStylesFromColorScheme,
	passedStyle,
	...props
} ) {
	return (
		<View
			style={ [
				getStylesFromColorScheme(
					styles.container,
					styles.containerDark
				),
				passedStyle,
			] }
		>
			<DropdownMenu controls={ controls } { ...props } />
		</View>
	);
}

export default withPreferredColorScheme( ToolbarGroupCollapsed );
