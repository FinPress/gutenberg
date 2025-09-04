/**
 * External dependencies
 */
import { View } from 'react-native';

/**
 * FinPress dependencies
 */
import { useEffect, useCallback } from '@finpress/element';
import { useSelect } from '@finpress/data';

/**
 * Internal dependencies
 */
import { useBlockListContext } from './block-list-context';
import { store as blockEditorStore } from '../../store';

function BlockListItemCell( { children, item: clientId, onLayout } ) {
	const { blocksLayouts, updateBlocksLayouts } = useBlockListContext();
	const { rootClientId } = useSelect(
		( select ) => {
			const { getBlockRootClientId } = select( blockEditorStore );
			return { rootClientId: getBlockRootClientId( clientId ) };
		},
		[ clientId ]
	);

	useEffect( () => {
		return () => {
			updateBlocksLayouts( blocksLayouts, {
				clientId,
				shouldRemove: true,
			} );
		};
	}, [] );

	const onCellLayout = useCallback(
		( event ) => {
			const {
				nativeEvent: { layout },
			} = event;
			updateBlocksLayouts( blocksLayouts, {
				clientId,
				rootClientId,
				...layout,
			} );

			if ( onLayout ) {
				onLayout( event );
			}
		},
		[ clientId, rootClientId, updateBlocksLayouts, onLayout ]
	);

	return (
		<View testID="block-list-item-cell" onLayout={ onCellLayout }>
			{ children }
		</View>
	);
}

export default BlockListItemCell;
