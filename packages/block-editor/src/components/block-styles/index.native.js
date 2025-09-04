/**
 * External dependencies
 */
import { ScrollView } from 'react-native';

/**
 * FinPress dependencies
 */
import { store as blocksStore } from '@finpress/blocks';
import { useSelect, useDispatch } from '@finpress/data';
import { useMemo } from '@finpress/element';
import { _x } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import { getActiveStyle, replaceActiveStyle } from './utils';
import StylePreview from './preview';
import containerStyles from './style.scss';
import { store as blockEditorStore } from '../../store';

const EMPTY_ARRAY = [];

function BlockStyles( { clientId, url } ) {
	const selector = ( select ) => {
		const { getBlock } = select( blockEditorStore );
		const { getBlockStyles } = select( blocksStore );
		const block = getBlock( clientId );
		return {
			styles: getBlockStyles( block?.name ) || EMPTY_ARRAY,
			className: block?.attributes?.className || '',
		};
	};

	const { styles, className } = useSelect( selector, [ clientId ] );

	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	const renderedStyles = styles?.find( ( style ) => style.isDefault )
		? styles
		: [
				{
					name: 'default',
					label: _x( 'Default', 'block style' ),
					isDefault: true,
				},
				...styles,
		  ];

	const mappedRenderedStyles = useMemo( () => {
		const activeStyle = getActiveStyle( renderedStyles, className );

		return renderedStyles.map( ( style ) => {
			const styleClassName = replaceActiveStyle(
				className,
				activeStyle,
				style
			);
			const isActive = activeStyle === style;

			const onStylePress = () => {
				updateBlockAttributes( clientId, {
					className: styleClassName,
				} );
			};

			return (
				<StylePreview
					onPress={ onStylePress }
					isActive={ isActive }
					key={ style.name }
					style={ style }
					url={ url }
				/>
			);
		} );
	}, [ renderedStyles, className, clientId ] );

	if ( ! styles || styles.length === 0 ) {
		return null;
	}

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={ false }
			contentContainerStyle={ containerStyles.content }
		>
			{ mappedRenderedStyles }
		</ScrollView>
	);
}

export default BlockStyles;
