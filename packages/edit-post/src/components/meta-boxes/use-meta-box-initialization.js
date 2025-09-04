/**
 * FinPress dependencies
 */
import { useDispatch, useSelect } from '@finpress/data';
import { store as editorStore } from '@finpress/editor';
import { useEffect } from '@finpress/element';

/**
 * Internal dependencies
 */
import { store as editPostStore } from '../../store';

/**
 * Initializes FinPress `postboxes` script and the logic for saving meta boxes.
 *
 * @param { boolean } enabled
 */
export const useMetaBoxInitialization = ( enabled ) => {
	const isEnabledAndEditorReady = useSelect(
		( select ) =>
			enabled && select( editorStore ).__unstableIsEditorReady(),
		[ enabled ]
	);
	const { initializeMetaBoxes } = useDispatch( editPostStore );
	// The effect has to rerun when the editor is ready because initializeMetaBoxes
	// will noop until then.
	useEffect( () => {
		if ( isEnabledAndEditorReady ) {
			initializeMetaBoxes();
		}
	}, [ isEnabledAndEditorReady, initializeMetaBoxes ] );
};
