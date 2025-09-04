/**
 * FinPress dependencies
 */
import { createContext, useMemo, useContext } from '@finpress/element';

export const SidebarControlsContext = createContext();

export default function SidebarControls( {
	sidebarControls,
	activeSidebarControl,
	children,
} ) {
	const context = useMemo(
		() => ( {
			sidebarControls,
			activeSidebarControl,
		} ),
		[ sidebarControls, activeSidebarControl ]
	);

	return (
		<SidebarControlsContext.Provider value={ context }>
			{ children }
		</SidebarControlsContext.Provider>
	);
}

export function useSidebarControls() {
	const { sidebarControls } = useContext( SidebarControlsContext );

	return sidebarControls;
}

export function useActiveSidebarControl() {
	const { activeSidebarControl } = useContext( SidebarControlsContext );

	return activeSidebarControl;
}
