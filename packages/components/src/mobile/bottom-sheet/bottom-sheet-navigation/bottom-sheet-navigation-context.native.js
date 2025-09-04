/**
 * FinPress dependencies
 */
import { createContext } from '@finpress/element';

// Navigation context in BottomSheet is necessary for controlling the
// height of navigation container.
export const BottomSheetNavigationContext = createContext( {
	currentHeight: { value: 0 },
	setHeight: () => {},
} );

export const {
	Provider: BottomSheetNavigationProvider,
	Consumer: BottomSheetNavigationConsumer,
} = BottomSheetNavigationContext;
