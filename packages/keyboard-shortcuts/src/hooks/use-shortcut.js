/**
 * WordPress dependencies
 */
import { useContext, useEffect, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import useShortcutEventMatch from './use-shortcut-event-match';
import { context } from '../context';
import { store as keyboardShortcutsStore } from '../store';

/**
 * Attach a keyboard shortcut handler.
 *
 * @param {string}   name               Shortcut name.
 * @param {Function} callback           Shortcut callback.
 * @param {Object}   options            Shortcut options.
 * @param {boolean}  options.isDisabled Whether to disable to shortut.
 */
export default function useShortcut(
	name,
	callback,
	{ isDisabled = false } = {}
) {
	const shortcuts = useContext( context );
	const isMatch = useShortcutEventMatch();
	const callbackRef = useRef();

	const areShortcutsEnabled = useSelect(
		( select ) => select( keyboardShortcutsStore ).areShortcutsEnabled(),
		[]
	);

	useEffect( () => {
		callbackRef.current = callback;
	}, [ callback ] );

	useEffect( () => {
		if ( isDisabled || ! areShortcutsEnabled ) {
			return;
		}

		function _callback( event ) {
			if ( isMatch( name, event ) ) {
				callbackRef.current( event );
			}
		}

		shortcuts.add( _callback );
		return () => {
			shortcuts.delete( _callback );
		};
	}, [ name, isDisabled, shortcuts, areShortcutsEnabled ] );
}
