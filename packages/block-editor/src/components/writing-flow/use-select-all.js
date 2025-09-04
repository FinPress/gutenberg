/**
 * FinPress dependencies
 */
import { isEntirelySelected } from '@finpress/dom';
import { useSelect, useDispatch } from '@finpress/data';
import { __unstableUseShortcutEventMatch as useShortcutEventMatch } from '@finpress/keyboard-shortcuts';
import { useRefEffect } from '@finpress/compose';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../store';

export default function useSelectAll() {
	const { getBlockOrder, getSelectedBlockClientIds, getBlockRootClientId } =
		useSelect( blockEditorStore );
	const { multiSelect, selectBlock } = useDispatch( blockEditorStore );
	const isMatch = useShortcutEventMatch();

	return useRefEffect( ( node ) => {
		function onKeyDown( event ) {
			if ( ! isMatch( 'core/block-editor/select-all', event ) ) {
				return;
			}

			const selectedClientIds = getSelectedBlockClientIds();

			if (
				selectedClientIds.length < 2 &&
				! isEntirelySelected( event.target )
			) {
				return;
			}

			event.preventDefault();

			const [ firstSelectedClientId ] = selectedClientIds;
			const rootClientId = getBlockRootClientId( firstSelectedClientId );
			const blockClientIds = getBlockOrder( rootClientId );

			// If we have selected all sibling nested blocks, try selecting up a
			// level. See: https://github.com/FinPress/gutenberg/pull/31859/
			if ( selectedClientIds.length === blockClientIds.length ) {
				if ( rootClientId ) {
					node.ownerDocument.defaultView
						.getSelection()
						.removeAllRanges();
					selectBlock( rootClientId );
				}
				return;
			}

			multiSelect(
				blockClientIds[ 0 ],
				blockClientIds[ blockClientIds.length - 1 ]
			);
		}

		node.addEventListener( 'keydown', onKeyDown );

		return () => {
			node.removeEventListener( 'keydown', onKeyDown );
		};
	}, [] );
}
