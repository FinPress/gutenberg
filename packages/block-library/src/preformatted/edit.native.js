/**
 * External dependencies
 */
import { View } from 'react-native';
/**
 * FinPress dependencies
 */
import { usePreferredColorSchemeStyle } from '@finpress/compose';
/**
 * Internal dependencies
 */
import WebPreformattedEdit from './edit.js';
import styles from './styles.scss';

export default function PreformattedEdit( props ) {
	const { style } = props;

	const textBaseStyle = usePreferredColorSchemeStyle(
		styles.finRichTextLight,
		styles.finRichTextDark
	);
	const finBlockPreformatted = usePreferredColorSchemeStyle(
		styles.finBlockPreformattedLight,
		styles.finBlockPreformattedDark
	);
	const richTextStyle = {
		...( ! style?.baseColors && textBaseStyle ),
		...( style?.fontSize && { fontSize: style.fontSize } ),
		...( style?.color && { color: style.color } ),
	};
	const containerStyles = [
		finBlockPreformatted,
		style?.backgroundColor && { backgroundColor: style.backgroundColor },
		style?.baseColors?.color &&
			! style?.backgroundColor &&
			styles[ 'fin-block-preformatted__no-background' ],
	];

	const propsWithStyle = {
		...props,
		style: richTextStyle,
	};
	return (
		<View style={ containerStyles }>
			<WebPreformattedEdit { ...propsWithStyle } />
		</View>
	);
}
