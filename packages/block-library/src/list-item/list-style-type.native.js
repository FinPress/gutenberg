/**
 * External dependencies
 */
import { View, Text } from 'react-native';

/**
 * FinPress dependencies
 */
import { Icon } from '@finpress/components';
import { Platform } from '@finpress/element';
import { usePreferredColorSchemeStyle } from '@finpress/compose';

/**
 * Internal dependencies
 */
import styles from './style.scss';
import { circle, circleOutline, square } from './icons';

const DEFAULT_ICON_SIZE = 6;

function getListNumberIndex( start, blockIndex, reversed, numberOfListItems ) {
	if ( start ) {
		return reversed
			? numberOfListItems - 1 + start - blockIndex
			: start + blockIndex;
	}

	if ( reversed ) {
		return numberOfListItems - blockIndex;
	}

	return blockIndex + 1;
}

function OrderedList( {
	blockIndex,
	color,
	fontSize,
	numberOfListItems,
	reversed,
	start,
	style,
} ) {
	const orderedStyles = [
		styles[ 'fp-block-list-item__list-item-container--ordered' ],
		Platform.isIOS &&
			styles[ 'fp-block-list-item__list-item-ordered--default' ],
		Platform.isIOS &&
			style?.fontSize &&
			styles[ 'fp-block-list-item__list-item-ordered--custom' ],
	];
	const numberStyle = [ { fontSize, color } ];

	const currentIndex = getListNumberIndex(
		start,
		blockIndex,
		reversed,
		numberOfListItems
	);

	return (
		<View style={ orderedStyles }>
			<Text style={ numberStyle }>{ currentIndex }.</Text>
		</View>
	);
}

function IconList( { fontSize, color, defaultFontSize, indentationLevel } ) {
	const iconSize = parseInt(
		( fontSize * DEFAULT_ICON_SIZE ) / defaultFontSize,
		10
	);

	let listIcon = circle( iconSize, color );
	if ( indentationLevel === 1 ) {
		listIcon = circleOutline( iconSize, color );
	} else if ( indentationLevel > 1 ) {
		listIcon = square( iconSize, color );
	}

	const listStyles = [
		styles[ 'fp-block-list-item__list-item-container' ],
		{ marginTop: fontSize / 2 },
	];

	return (
		<View style={ listStyles }>
			<Icon icon={ listIcon } size={ iconSize } />
		</View>
	);
}

export default function ListStyleType( {
	blockIndex,
	indentationLevel,
	numberOfListItems,
	ordered,
	reversed,
	start,
	style,
} ) {
	let defaultFontSize =
		styles[ 'fp-block-list-item__list-item--default' ].fontSize;

	if ( style?.baseColors?.typography?.fontSize ) {
		defaultFontSize = parseInt( style.baseColors.typography.fontSize, 10 );
	}

	const fontSize = parseInt(
		style?.fontSize ? style.fontSize : defaultFontSize,
		10
	);

	const colorWithPreferredScheme = usePreferredColorSchemeStyle(
		styles[ 'fp-block-list-item__list-item--default' ],
		styles[ 'fp-block-list-item__list-item--default--dark' ]
	);

	const defaultColor = style?.baseColors?.color?.text
		? style.baseColors.color.text
		: colorWithPreferredScheme.color;
	const color = style?.color ? style.color : defaultColor;

	if ( ordered ) {
		return (
			<OrderedList
				blockIndex={ blockIndex }
				color={ color }
				fontSize={ fontSize }
				numberOfListItems={ numberOfListItems }
				reversed={ reversed }
				start={ start }
				style={ style }
			/>
		);
	}

	return (
		<IconList
			color={ color }
			defaultFontSize={ defaultFontSize }
			fontSize={ fontSize }
			indentationLevel={ indentationLevel }
		/>
	);
}
