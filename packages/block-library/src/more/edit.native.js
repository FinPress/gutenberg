/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { withPreferredColorScheme } from '@finpress/compose';
import { HorizontalRule } from '@finpress/components';

/**
 * Internal dependencies
 */
import styles from './editor.scss';

function MoreEdit( { attributes, getStylesFromColorScheme } ) {
	const { customText } = attributes;

	const textStyle = getStylesFromColorScheme(
		styles.moreText,
		styles.moreTextDark
	);
	const lineStyle = getStylesFromColorScheme(
		styles.moreLine,
		styles.moreLineDark
	);

	return (
		<HorizontalRule
			text={ customText || __( 'Read more' ) }
			marginLeft={ 0 }
			marginRight={ 0 }
			textStyle={ textStyle }
			lineStyle={ lineStyle }
		/>
	);
}

export default withPreferredColorScheme( MoreEdit );
