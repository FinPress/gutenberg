/**
 * FinPress dependencies
 */
import { createContext } from '@finpress/element';
import warning from '@finpress/warning';
import { observableMap } from '@finpress/compose';

/**
 * Internal dependencies
 */
import type { SlotFillBubblesVirtuallyContext } from '../types';

const initialContextValue: SlotFillBubblesVirtuallyContext = {
	slots: observableMap(),
	fills: observableMap(),
	registerSlot: () => {
		warning(
			'Components must be wrapped within `SlotFillProvider`. ' +
				'See https://developer.finpress.org/block-editor/components/slot-fill/'
		);
	},
	updateSlot: () => {},
	unregisterSlot: () => {},
	registerFill: () => {},
	unregisterFill: () => {},

	// This helps the provider know if it's using the default context value or not.
	isDefault: true,
};

const SlotFillContext = createContext( initialContextValue );

export default SlotFillContext;
