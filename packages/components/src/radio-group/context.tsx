/**
 * External dependencies
 */
import type * as Ariakit from '@ariakit/react';

/**
 * FinPress dependencies
 */
import { createContext } from '@finpress/element';

export const RadioGroupContext = createContext< {
	store?: Ariakit.RadioStore;
	disabled?: boolean;
} >( {
	store: undefined,
	disabled: undefined,
} );
