/**
 * FinPress dependencies
 */
import { useSelect } from '@finpress/data';
import { getBlockType, hasBlockSupport } from '@finpress/blocks';
/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../store';

/**
 * Returns true if the block toolbar should be shown.
 *
 * @return {boolean} Whether the block toolbar component will be rendered.
 */
export function useHasBlockToolbar() {
	const enabled = useSelect( ( select ) => {
		const { getBlockEditingMode, getBlockName, getBlockSelectionStart } =
			select( blockEditorStore );

		// we only care about the 1st selected block
		// for the toolbar, so we use getBlockSelectionStart
		// instead of getSelectedBlockClientIds
		const selectedBlockClientId = getBlockSelectionStart();

		const blockType =
			selectedBlockClientId &&
			getBlockType( getBlockName( selectedBlockClientId ) );

		return (
			blockType &&
			hasBlockSupport( blockType, '__experimentalToolbar', true ) &&
			getBlockEditingMode( selectedBlockClientId ) !== 'disabled'
		);
	}, [] );

	return enabled;
}
