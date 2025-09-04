/**
 * External dependencies
 */
import { View } from 'react-native';

/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import styles from './style.scss';
import { HelpDetailBodyText, HelpDetailImage } from './view-sections';

const RemoveBlocks = () => {
	return (
		<>
			<HelpDetailImage
				source={ require( './images/options-light.png' ) }
				sourceDarkMode={ require( './images/options-dark.png' ) }
			/>
			<View style={ styles.helpDetailContainer }>
				<HelpDetailBodyText
					text={ __(
						'To remove a block, select the block and click the three dots in the bottom right of the block to view the settings. From there, choose the option to remove the block.'
					) }
				/>
			</View>
		</>
	);
};

export default RemoveBlocks;
