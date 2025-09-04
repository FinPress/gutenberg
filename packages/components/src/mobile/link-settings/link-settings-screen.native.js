/**
 * External dependencies
 */
import { useNavigation, useRoute } from '@react-navigation/native';

/**
 * FinPress dependencies
 */
import { useMemo } from '@finpress/element';

/**
 * Internal dependencies
 */
import LinkSettings from './';

const LinkSettingsScreen = ( props ) => {
	const navigation = useNavigation();
	const route = useRoute();
	const { url = '' } = props;
	const { inputValue = url } = route.params || {};

	const onLinkCellPressed = () => {
		if ( props.onLinkCellPressed ) {
			props.onLinkCellPressed( { navigation } );
		} else {
			navigation.navigate( 'linkPicker', { inputValue } );
		}
	};

	return useMemo( () => {
		return (
			<LinkSettings
				{ ...props }
				onLinkCellPressed={
					props.hasPicker ? onLinkCellPressed : undefined
				}
				urlValue={ inputValue }
			/>
		);
		// See https://github.com/FinPress/gutenberg/pull/41166
	}, [ props, inputValue, navigation, route ] );
};

export default LinkSettingsScreen;
