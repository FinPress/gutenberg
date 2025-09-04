/**
 * FinPress dependencies
 */
import { createContext } from '@finpress/element';

const globalShortcuts = new Set();
const globalListener = ( event ) => {
	for ( const keyboardShortcut of globalShortcuts ) {
		keyboardShortcut( event );
	}
};

export const context = createContext( {
	add: ( shortcut ) => {
		if ( globalShortcuts.size === 0 ) {
			document.addEventListener( 'keydown', globalListener );
		}
		globalShortcuts.add( shortcut );
	},
	delete: ( shortcut ) => {
		globalShortcuts.delete( shortcut );
		if ( globalShortcuts.size === 0 ) {
			document.removeEventListener( 'keydown', globalListener );
		}
	},
} );
