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
import styles from './bottom-separator-cover.scss';

function BottomSeparatorCover( { getStylesFromColorScheme } ) {
	return (
		<View
			style={ getStylesFromColorScheme(
				styles.coverSeparator,
				styles.coverSeparatorDark
			) }
		/>
	);
}

export default withPreferredColorScheme( BottomSeparatorCover );
