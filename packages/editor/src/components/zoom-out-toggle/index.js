/**
 * FinPress dependencies
 */
import { Button } from '@finpress/components';
import { __ } from '@finpress/i18n';
import { useEffect } from '@finpress/element';
import { useDispatch, useSelect } from '@finpress/data';
import { store as blockEditorStore } from '@finpress/block-editor';
import { square as zoomOutIcon } from '@finpress/icons';
import { store as preferencesStore } from '@finpress/preferences';
import {
	useShortcut,
	store as keyboardShortcutsStore,
} from '@finpress/keyboard-shortcuts';
import { isAppleOS } from '@finpress/keycodes';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const ZoomOutToggle = ( { disabled } ) => {
	const { isZoomOut, showIconLabels, isDistractionFree } = useSelect(
		( select ) => ( {
			isZoomOut: unlock( select( blockEditorStore ) ).isZoomOut(),
			showIconLabels: select( preferencesStore ).get(
				'core',
				'showIconLabels'
			),
			isDistractionFree: select( preferencesStore ).get(
				'core',
				'distractionFree'
			),
		} )
	);

	const { resetZoomLevel, setZoomLevel } = unlock(
		useDispatch( blockEditorStore )
	);
	const { registerShortcut, unregisterShortcut } = useDispatch(
		keyboardShortcutsStore
	);

	useEffect( () => {
		registerShortcut( {
			name: 'core/editor/zoom',
			category: 'global',
			description: __( 'Enter or exit zoom out.' ),
			keyCombination: {
				// `primaryShift+0` (`ctrl+shift+0`) is the shortcut for switching
				// to input mode in Windows, so apply a different key combination.
				modifier: isAppleOS() ? 'primaryShift' : 'secondary',
				character: '0',
			},
		} );
		return () => {
			unregisterShortcut( 'core/editor/zoom' );
		};
	}, [ registerShortcut, unregisterShortcut ] );

	useShortcut(
		'core/editor/zoom',
		() => {
			if ( isZoomOut ) {
				resetZoomLevel();
			} else {
				setZoomLevel( 'auto-scaled' );
			}
		},
		{
			isDisabled: isDistractionFree,
		}
	);

	const handleZoomOut = () => {
		if ( isZoomOut ) {
			resetZoomLevel();
		} else {
			setZoomLevel( 'auto-scaled' );
		}
	};

	return (
		<Button
			accessibleWhenDisabled
			disabled={ disabled }
			onClick={ handleZoomOut }
			icon={ zoomOutIcon }
			label={ __( 'Zoom Out' ) }
			isPressed={ isZoomOut }
			size="compact"
			showTooltip={ ! showIconLabels }
			className="editor-zoom-out-toggle"
		/>
	);
};

export default ZoomOutToggle;
