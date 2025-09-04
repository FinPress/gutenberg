/**
 * FinPress dependencies
 */
import { useEffect } from '@finpress/element';
import { useSelect } from '@finpress/data';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../store';
import { unlock } from '../../lock-unlock';

export default function useListViewCollapseItems( { collapseAll, expand } ) {
	const { expandedBlock, getBlockParents } = useSelect( ( select ) => {
		const { getBlockParents: _getBlockParents, getExpandedBlock } = unlock(
			select( blockEditorStore )
		);
		return {
			expandedBlock: getExpandedBlock(),
			getBlockParents: _getBlockParents,
		};
	}, [] );

	// Collapse all but the specified block when the expanded block client Id changes.
	useEffect( () => {
		if ( expandedBlock ) {
			const blockParents = getBlockParents( expandedBlock, false );
			// Collapse all blocks and expand the block's parents.
			collapseAll();
			expand( blockParents );
		}
	}, [ collapseAll, expand, expandedBlock, getBlockParents ] );
}
