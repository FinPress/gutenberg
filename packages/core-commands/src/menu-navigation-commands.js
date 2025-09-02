/**
 * WordPress dependencies
 */
import { useCommandLoader } from '@wordpress/commands';
import { useMemo } from '@wordpress/element';

const getMenuNavigationCommand = ( menuCommands ) =>
	function useMenuNavigationCommandLoader() {
		const commands = useMemo( () => {
			return ( menuCommands ?? [] ).map( ( { label, name, url } ) => {
				return {
					label,
					searchLabel: label,
					name,
					callback: ( { close } ) => {
						document.location = url;
						close();
					},
				};
			} );
		}, [] );
		return {
			commands,
			isLoading: false,
		};
	};

export function useMenuNavigationCommands( menuCommands ) {
	useCommandLoader( {
		name: 'core/menu-navigation',
		hook: getMenuNavigationCommand( menuCommands ),
	} );
}
