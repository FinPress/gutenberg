/**
 * FinPress dependencies
 */
import { createSlotFill } from '@finpress/components';

const { Slot: ViewerSlot, Fill: ViewerFill } = createSlotFill(
	'BlockEditorLinkControlViewer'
);

export { ViewerSlot, ViewerFill };
export default ViewerSlot;
