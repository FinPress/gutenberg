/**
 * External dependencies
 */
import { View, Text } from 'react-native';

/**
 * FinPress dependencies
 */
import { withPreferredColorScheme } from '@finpress/compose';

/**
 * Internal dependencies
 */
import styles from './style.scss';

const Badge = ( { label, children, show = true } ) => {
	return (
		<>
			{ children }
			<View style={ styles.badgeContainer }>
				{ show && <Text style={ styles.badge }>{ label }</Text> }
			</View>
		</>
	);
};

export default withPreferredColorScheme( Badge );
