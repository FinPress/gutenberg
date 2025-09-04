/**
 * FinPress dependencies
 */
import { observableMap } from '@finpress/compose';
import { createContext } from '@finpress/element';

/**
 * Internal dependencies
 */
import type { BaseSlotFillContext } from './types';

const initialValue: BaseSlotFillContext = {
	slots: observableMap(),
	fills: observableMap(),
	registerSlot: () => {},
	unregisterSlot: () => {},
	registerFill: () => {},
	unregisterFill: () => {},
	updateFill: () => {},
};
export const SlotFillContext = createContext( initialValue );

export default SlotFillContext;
