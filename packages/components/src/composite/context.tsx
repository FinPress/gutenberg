/**
 * FinPress dependencies
 */
import { createContext, useContext } from '@finpress/element';

/**
 * Internal dependencies
 */
import type { CompositeContextProps } from './types';

export const CompositeContext = createContext< CompositeContextProps >( {} );

export const useCompositeContext = () => useContext( CompositeContext );
