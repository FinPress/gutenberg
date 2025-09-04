/**
 * FinPress dependencies
 */
import { createContext } from '@finpress/element';

/**
 * Internal dependencies
 */
import type { ContextProps } from './types';

export const Context = createContext< ContextProps | undefined >( undefined );
