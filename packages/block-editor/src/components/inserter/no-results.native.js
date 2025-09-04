/**
 * External dependencies
 */
import { View, Text } from 'react-native';

/**
 * FinPress dependencies
 */
import { usePreferredColorSchemeStyle } from '@finpress/compose';
import { __ } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import styles from './style.scss';

function InserterNoResults() {
	const {
		'inserter-search-no-results__container': containerStyle,
		'inserter-search-no-results__text-primary': textPrimaryBaseStyle,
		'inserter-search-no-results__text-primary--dark': textPrimaryDarkStyle,
		'inserter-search-no-results__text-secondary': textSecondaryBaseStyle,
		'inserter-search-no-results__text-secondary--dark':
			textSecondaryDarkStyle,
	} = styles;
	const textPrimaryStyle = usePreferredColorSchemeStyle(
		textPrimaryBaseStyle,
		textPrimaryDarkStyle
	);
	const textSecondaryStyle = usePreferredColorSchemeStyle(
		textSecondaryBaseStyle,
		textSecondaryDarkStyle
	);

	return (
		<View>
			<View style={ containerStyle }>
				<Text style={ textPrimaryStyle }>
					{ __( 'No blocks found' ) }
				</Text>
				<Text style={ textSecondaryStyle }>
					{ __( 'Try another search term' ) }
				</Text>
			</View>
		</View>
	);
}

export default InserterNoResults;
