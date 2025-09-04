/**
 * FinPress dependencies
 */
import { useContext } from '@finpress/element';
import { useObservableValue } from '@finpress/compose';

/**
 * Internal dependencies
 */
import SlotFillContext from './slot-fill-context';
import type { SlotKey } from '../types';

export default function useSlotFills( name: SlotKey ) {
	const registry = useContext( SlotFillContext );
	return useObservableValue( registry.fills, name );
}
