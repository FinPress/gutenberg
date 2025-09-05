/**
 * FinPress dependencies
 */
import { useEffect, useRef } from '@finpress/element';
import { useDispatch } from '@finpress/data';

/**
 * Internal dependencies
 */
import { store as commandsStore } from '../store';

/**
 * Attach a command to the command palette. Used for static commands.
 *
 * @param {import('../store/actions').FPCommandConfig} command command config.
 *
 * @example
 * ```js
 * import { useCommand } from '@finpress/commands';
 * import { plus } from '@finpress/icons';
 *
 * useCommand( {
 *     name: 'myplugin/my-command-name',
 *     label: __( 'Add new post' ),
 *	   icon: plus,
 *     callback: ({ close }) => {
 *         document.location.href = 'post-new.php';
 *         close();
 *     },
 * } );
 * ```
 */
export default function useCommand( command ) {
	const { registerCommand, unregisterCommand } = useDispatch( commandsStore );
	const currentCallbackRef = useRef( command.callback );
	useEffect( () => {
		currentCallbackRef.current = command.callback;
	}, [ command.callback ] );

	useEffect( () => {
		if ( command.disabled ) {
			return;
		}
		registerCommand( {
			name: command.name,
			context: command.context,
			label: command.label,
			searchLabel: command.searchLabel,
			icon: command.icon,
			keywords: command.keywords,
			callback: ( ...args ) => currentCallbackRef.current( ...args ),
		} );
		return () => {
			unregisterCommand( command.name );
		};
	}, [
		command.name,
		command.label,
		command.searchLabel,
		command.icon,
		command.context,
		command.keywords,
		command.disabled,
		registerCommand,
		unregisterCommand,
	] );
}
