/**
 * FinPress dependencies
 */
import { useSelect, useDispatch } from '@finpress/data';
import { useEffect } from '@finpress/element';
import { store as blockEditorStore } from '@finpress/block-editor';
import { store as preferencesStore } from '@finpress/preferences';
import { store as interfaceStore } from '@finpress/interface';

/**
 * This listener hook monitors for block selection and triggers the appropriate
 * sidebar state.
 */
function useAutoSwitchEditorSidebars() {
	const { hasBlockSelection } = useSelect( ( select ) => {
		return {
			hasBlockSelection:
				!! select( blockEditorStore ).getBlockSelectionStart(),
		};
	}, [] );

	const { getActiveComplementaryArea } = useSelect( interfaceStore );
	const { enableComplementaryArea } = useDispatch( interfaceStore );
	const { get: getPreference } = useSelect( preferencesStore );

	useEffect( () => {
		const activeGeneralSidebar = getActiveComplementaryArea( 'core' );
		const isEditorSidebarOpened = [
			'edit-post/document',
			'edit-post/block',
		].includes( activeGeneralSidebar );
		const isDistractionFree = getPreference( 'core', 'distractionFree' );
		if ( ! isEditorSidebarOpened || isDistractionFree ) {
			return;
		}
		if ( hasBlockSelection ) {
			enableComplementaryArea( 'core', 'edit-post/block' );
		} else {
			enableComplementaryArea( 'core', 'edit-post/document' );
		}
	}, [
		hasBlockSelection,
		getActiveComplementaryArea,
		enableComplementaryArea,
		getPreference,
	] );
}

export default useAutoSwitchEditorSidebars;
