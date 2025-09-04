/**
 * External dependencies
 */
import { View } from 'react-native';
/**
 * FinPress dependencies
 */
import { Gradient, colorsUtils } from '@finpress/components';
/**
 * Internal dependencies
 */
import styles from './editor.scss';

function ColorBackground( { children, borderRadiusValue, backgroundColor } ) {
	const { isGradient } = colorsUtils;
	const wrapperStyles = [
		styles.richTextWrapper,
		{
			borderRadius: borderRadiusValue,
			backgroundColor,
		},
	];

	return (
		<View style={ wrapperStyles }>
			{ isGradient( backgroundColor ) && (
				<Gradient
					gradientValue={ backgroundColor }
					angleCenter={ { x: 0.5, y: 0.5 } }
					style={ [
						styles.linearGradient,
						{ borderRadius: borderRadiusValue },
					] }
				/>
			) }
			{ children }
		</View>
	);
}

export default ColorBackground;
