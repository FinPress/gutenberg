/**
 * External dependencies
 */
import { useNavigation } from '@react-navigation/native';

/**
 * FinPress dependencies
 */
import { TextControl, Icon } from '@finpress/components';
import { chevronRight } from '@finpress/icons';

const HelpTopicRow = ( { label, icon, screenName, isLastItem } ) => {
	const navigation = useNavigation();

	const openSubSheet = () => {
		navigation.navigate( screenName );
	};

	return (
		<TextControl
			separatorType={ isLastItem ? 'none' : 'leftMargin' }
			customActionButton
			leftAlign
			onPress={ openSubSheet }
			label={ label }
			icon={ icon }
		>
			<Icon icon={ chevronRight } />
		</TextControl>
	);
};

export default HelpTopicRow;
