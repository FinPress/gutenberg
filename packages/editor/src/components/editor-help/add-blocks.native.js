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

const AddBlocks = () => {
	return (
		<>
			<HelpDetailImage
				source={ require( './images/add-light.png' ) }
				sourceDarkMode={ require( './images/add-dark.png' ) }
			/>
			<View style={ styles.helpDetailContainer }>
				<HelpDetailBodyText
					text={ __(
						'Add a new block at any time by tapping on the + icon in the toolbar on the bottom left.'
					) }
				/>
				<HelpDetailBodyText
					text={ __(
						'Once you become familiar with the names of different blocks, you can add a block by typing a forward slash followed by the block name — for example, /image or /heading.'
					) }
				/>
			</View>
		</>
	);
};

export default AddBlocks;
