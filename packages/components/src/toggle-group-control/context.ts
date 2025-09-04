/**
 * FinPress dependencies
 */
import { createContext, useContext } from '@finpress/element';

/**
 * Internal dependencies
 */
import type { ToggleGroupControlContextProps } from './types';

const ToggleGroupControlContext = createContext(
	{} as ToggleGroupControlContextProps
);
export const useToggleGroupControlContext = () =>
	useContext( ToggleGroupControlContext );
export default ToggleGroupControlContext;
