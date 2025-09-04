/**
 * External dependencies
 */
import { View, Text, Platform } from 'react-native';

/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { Icon, check } from '@finpress/icons';
import { usePreferredColorSchemeStyle } from '@finpress/compose';

/**
 * Internal dependencies
 */
import styles from './styles.scss';
import ActionButton from './action-button';

function ApplyButton( { onPress } ) {
	const buttonTextStyle = usePreferredColorSchemeStyle(
		styles[ 'button-text' ],
		styles[ 'button-text-dark' ]
	);

	const applyButtonStyle = usePreferredColorSchemeStyle(
		styles[ 'apply-button-icon' ],
		styles[ 'apply-button-icon-dark' ]
	);

	return (
		<View style={ styles[ 'apply-button' ] }>
			<ActionButton
				onPress={ onPress }
				accessibilityLabel={ __( 'Apply' ) }
				accessibilityHint={ __( 'Applies the setting' ) }
			>
				{ Platform.OS === 'ios' ? (
					<Text style={ buttonTextStyle } maxFontSizeMultiplier={ 2 }>
						{ __( 'Apply' ) }
					</Text>
				) : (
					<Icon
						icon={ check }
						size={ 24 }
						style={ applyButtonStyle }
					/>
				) }
			</ActionButton>
		</View>
	);
}

export default ApplyButton;
