/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { focusListItem } from '../utils';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../../store';

const useFocusListItem = ( listViewRef ) => {
	const { selectedBlockClientIds, firstBlock } = useSelect( ( select ) => {
		const { getSelectedBlockClientIds, getBlocks } =
			select( blockEditorStore );
		const [ _firstBlock ] = getBlocks();
		return {
			selectedBlockClientIds: getSelectedBlockClientIds(),
			firstBlock: _firstBlock,
		};
	} );

	useEffect( () => {
		if ( !! selectedBlockClientIds?.length ) {
			focusListItem( selectedBlockClientIds[ 0 ], listViewRef );
		} else if ( firstBlock ) {
			focusListItem( firstBlock.clientId, listViewRef );
		}
	}, [ selectedBlockClientIds, firstBlock, listViewRef ] );
};

export default useFocusListItem;
