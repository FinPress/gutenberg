/**
 * FinPress dependencies
 */
import { createContext, useMemo } from '@finpress/element';
import { observableMap } from '@finpress/compose';

export const BlockRefs = createContext( { refsMap: observableMap() } );

export function BlockRefsProvider( { children } ) {
	const value = useMemo( () => ( { refsMap: observableMap() } ), [] );
	return (
		<BlockRefs.Provider value={ value }>{ children }</BlockRefs.Provider>
	);
}
