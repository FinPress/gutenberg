/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../store';
import { unlock } from '../lock-unlock';

/**
 * A hook used to set the editor mode to zoomed out mode, invoking the hook sets the mode.
 * Concepts:
 * - If we most recently changed the zoom level for them (in or out), we always resetZoomLevel() level when unmounting.
 * - If the user most recently changed the zoom level (manually toggling), we do nothing when unmounting.
 *
 * @param {boolean} enabled If we should enter into zoomOut mode or not
 */
export function useZoomOut( enabled = true ) {
	const { setZoomLevel, resetZoomLevel } = unlock(
		useDispatch( blockEditorStore )
	);
	const { isZoomOut } = unlock( useSelect( blockEditorStore ) );

	const isZoomedOut = isZoomOut();
	const controlZoomLevelRef = useRef( false );
	const isEnabledRef = useRef( enabled );

	/**
	 * This hook tracks if the zoom state was changed manually by the user via clicking
	 * the zoom out button. We only want this to run when isZoomedOut changes, so we use
	 * a ref to track the enabled state.
	 */
	useEffect( () => {
		// If the zoom state changed (isZoomOut) and it does not match the requested zoom
		// state (zoomOut), then it means the user manually changed the zoom state while
		// this hook was mounted, and we should no longer control the zoom state.
		if ( isZoomedOut !== isEnabledRef.current ) {
			controlZoomLevelRef.current = false;
		}
	}, [ isZoomedOut ] );

	useEffect( () => {
		isEnabledRef.current = enabled;
		const isAlreadyZoomedOut = isZoomOut();

		if ( enabled !== isAlreadyZoomedOut ) {
			controlZoomLevelRef.current = true;

			if ( enabled ) {
				setZoomLevel( 'auto-scaled' );
			} else {
				resetZoomLevel();
			}
		}

		return () => {
			return (
				// If we are controlling zoom level and are zoomed out, reset the zoom level.
				controlZoomLevelRef.current && isZoomOut() && resetZoomLevel()
			);
		};
	}, [ enabled, isZoomOut, resetZoomLevel, setZoomLevel ] );
}
