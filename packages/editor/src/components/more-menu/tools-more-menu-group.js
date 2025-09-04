/**
 * FinPress dependencies
 */
import { createSlotFill } from '@finpress/components';

const { Fill: ToolsMoreMenuGroup, Slot } =
	createSlotFill( 'ToolsMoreMenuGroup' );

ToolsMoreMenuGroup.Slot = ( { fillProps } ) => <Slot fillProps={ fillProps } />;

export default ToolsMoreMenuGroup;
