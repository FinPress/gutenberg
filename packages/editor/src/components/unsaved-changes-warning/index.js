/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { useEffect } from '@finpress/element';
import { useSelect } from '@finpress/data';
import { store as coreStore } from '@finpress/core-data';

/**
 * Warns the user if there are unsaved changes before leaving the editor.
 * Compatible with Post Editor and Site Editor.
 *
 * @return {React.ReactNode} The component.
 */
export default function UnsavedChangesWarning() {
	const { __experimentalGetDirtyEntityRecords } = useSelect( coreStore );

	useEffect( () => {
		/**
		 * Warns the user if there are unsaved changes before leaving the editor.
		 *
		 * @param {Event} event `beforeunload` event.
		 *
		 * @return {string | undefined} Warning prompt message, if unsaved changes exist.
		 */
		const warnIfUnsavedChanges = ( event ) => {
			// We need to call the selector directly in the listener to avoid race
			// conditions with `BrowserURL` where `componentDidUpdate` gets the
			// new value of `isEditedPostDirty` before this component does,
			// causing this component to incorrectly think a trashed post is still dirty.
			const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();
			if ( dirtyEntityRecords.length > 0 ) {
				event.returnValue = __(
					'You have unsaved changes. If you proceed, they will be lost.'
				);
				return event.returnValue;
			}
		};

		window.addEventListener( 'beforeunload', warnIfUnsavedChanges );

		return () => {
			window.removeEventListener( 'beforeunload', warnIfUnsavedChanges );
		};
	}, [ __experimentalGetDirtyEntityRecords ] );

	return null;
}
