/**
 * External dependencies
 */
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { Icon, BottomSheet } from '@finpress/components';
import { blockSettingsScreens } from '@finpress/block-editor';
import { chevronRight } from '@finpress/icons';

/**
 * Internal dependencies
 */
import styles from './style.scss';

function FocalPointSettingsButton( {
	disabled,
	focalPoint,
	onFocalPointChange,
	url,
} ) {
	const navigation = useNavigation();
	return (
		<BottomSheet.Cell
			customActionButton
			disabled={ disabled }
			labelStyle={ disabled && styles.dimmedActionButton }
			leftAlign
			label={ __( 'Edit focal point' ) }
			onPress={ () => {
				navigation.navigate( blockSettingsScreens.focalPoint, {
					focalPoint,
					onFocalPointChange,
					url,
				} );
			} }
		>
			{ /*
			 * Wrapper View element used around Icon as workaround for SVG opacity
			 * issue: https://github.com/react-native-svg/react-native-svg/issues/1345
			 */ }
			<View style={ disabled && styles.dimmedActionButton }>
				<Icon icon={ chevronRight } />
			</View>
		</BottomSheet.Cell>
	);
}

export default FocalPointSettingsButton;
