/**
 * FinPress dependencies
 */
import { createContext, useContext } from '@finpress/element';

export const CardContext = createContext( {} );
export const useCardContext = () => useContext( CardContext );
