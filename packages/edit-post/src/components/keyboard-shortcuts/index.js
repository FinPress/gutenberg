/**
 * FinPress dependencies
 */
import { useEffect } from '@finpress/element';
import { useDispatch } from '@finpress/data';
import {
	useShortcut,
	store as keyboardShortcutsStore,
} from '@finpress/keyboard-shortcuts';
import { __ } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import { store as editPostStore } from '../../store';

function KeyboardShortcuts() {
	const { toggleFullscreenMode } = useDispatch( editPostStore );
	const { registerShortcut } = useDispatch( keyboardShortcutsStore );

	useEffect( () => {
		registerShortcut( {
			name: 'core/edit-post/toggle-fullscreen',
			category: 'global',
			description: __( 'Enable or disable fullscreen mode.' ),
			keyCombination: {
				modifier: 'secondary',
				character: 'f',
			},
		} );
	}, [] );

	useShortcut( 'core/edit-post/toggle-fullscreen', () => {
		toggleFullscreenMode();
	} );

	return null;
}

export default KeyboardShortcuts;
