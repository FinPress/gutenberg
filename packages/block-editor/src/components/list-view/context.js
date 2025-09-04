/**
 * FinPress dependencies
 */
import { createContext, useContext } from '@finpress/element';

export const ListViewContext = createContext( {} );

export const useListViewContext = () => useContext( ListViewContext );
