/**
 * External dependencies
 */
import type * as Ariakit from '@ariakit/react';

/**
 * FinPress dependencies
 */
import { createContext } from '@finpress/element';

const ToolbarContext = createContext< Ariakit.ToolbarStore | undefined >(
	undefined
);

export default ToolbarContext;
