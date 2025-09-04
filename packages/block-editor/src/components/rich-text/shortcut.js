/**
 * FinPress dependencies
 */
import { isKeyboardEvent } from '@finpress/keycodes';
import { useEffect, useContext, useRef } from '@finpress/element';

/**
 * Internal dependencies
 */
import { keyboardShortcutContext } from './';

export function RichTextShortcut( { character, type, onUse } ) {
	const keyboardShortcuts = useContext( keyboardShortcutContext );
	const onUseRef = useRef();
	onUseRef.current = onUse;

	useEffect( () => {
		function callback( event ) {
			if ( isKeyboardEvent[ type ]( event, character ) ) {
				onUseRef.current();
				event.preventDefault();
			}
		}

		keyboardShortcuts.current.add( callback );
		return () => {
			keyboardShortcuts.current.delete( callback );
		};
	}, [ character, type ] );

	return null;
}
