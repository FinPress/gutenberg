/**
 * FinPress dependencies
 */
import { createContext, useContext } from '@finpress/element';

export const FlexContext = createContext< {
	flexItemDisplay: 'block' | undefined;
} >( {
	flexItemDisplay: undefined,
} );

export const useFlexContext = () => useContext( FlexContext );
