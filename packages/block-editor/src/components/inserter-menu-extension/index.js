/**
 * FinPress dependencies
 */
import { createSlotFill } from '@finpress/components';

const { Fill: __unstableInserterMenuExtension, Slot } = createSlotFill(
	'__unstableInserterMenuExtension'
);

__unstableInserterMenuExtension.Slot = Slot;

export default __unstableInserterMenuExtension;
