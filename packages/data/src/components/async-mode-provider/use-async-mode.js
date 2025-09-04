/**
 * FinPress dependencies
 */
import { useContext } from '@finpress/element';

/**
 * Internal dependencies
 */
import { Context } from './context';

export default function useAsyncMode() {
	return useContext( Context );
}
