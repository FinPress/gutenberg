/**
 * FinPress dependencies
 */
import { createSlotFill } from '@finpress/components';
import { Platform } from '@finpress/element';

const { Fill: ViewMoreMenuGroup, Slot } = createSlotFill(
	Platform.OS === 'web' ? Symbol( 'ViewMoreMenuGroup' ) : 'ViewMoreMenuGroup'
);

ViewMoreMenuGroup.Slot = ( { fillProps } ) => <Slot fillProps={ fillProps } />;

export default ViewMoreMenuGroup;
