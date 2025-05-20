/**
 * Internal dependencies
 */
import { ToggleGroupControl as BaseToggleGroupControl } from './toggle-group-control';
import { ToggleGroupControlOption } from './toggle-group-control-option';
import { ToggleGroupControlOptionIcon } from './toggle-group-control-option-icon';

/**
 * ToggleGroupControl is a form component that lets users choose options
 * from a group of toggle buttons. It provides a single-selection interface
 * with a consistent visual design.
 */
export const ToggleGroupControl = Object.assign( BaseToggleGroupControl, {
	/**
	 * Renders a standard toggle option button within a ToggleGroupControl.
	 * Used for text-based toggle options.
	 */
	Option: Object.assign( ToggleGroupControlOption, {
		displayName: 'ToggleGroupControl.Option',
	} ),
	/**
	 * Renders an icon toggle option button within a ToggleGroupControl.
	 * Used for icon-based toggle options.
	 */
	OptionIcon: Object.assign( ToggleGroupControlOptionIcon, {
		displayName: 'ToggleGroupControl.OptionIcon',
	} ),
} );

export default ToggleGroupControl;
