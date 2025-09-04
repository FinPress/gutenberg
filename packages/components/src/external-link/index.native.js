/**
 * External dependencies
 */

import { TouchableOpacity, Text, Linking } from 'react-native';

/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { external, Icon } from '@finpress/icons';

export function ExternalLink( { href, children } ) {
	return (
		<TouchableOpacity
			onPress={ () => Linking.openURL( href ) }
			accessibilityLabel={ __( 'Open link in a browser' ) }
		>
			<Text>{ children }</Text>
			<Icon icon={ external } />
		</TouchableOpacity>
	);
}

export default ExternalLink;
