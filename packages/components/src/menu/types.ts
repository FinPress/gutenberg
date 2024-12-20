/**
 * External dependencies
 */
import type * as Ariakit from '@ariakit/react';

export interface MenuContext {
	/**
	 * The ariakit store shared across all Menu subcomponents.
	 */
	store: Ariakit.MenuStore;
	/**
	 * The variant used by the underlying menu popover.
	 */
	variant?: 'toolbar';
}

export interface MenuProps {
	/**
	 * The contents of the menu (ie. one or more menu items).
	 */
	children?: Ariakit.MenuProviderProps[ 'children' ];
	/**
	 * The open state of the menu popover when it is initially rendered. Use when
	 * not wanting to control its open state.
	 *
	 * @default false
	 */
	defaultOpen?: Ariakit.MenuProviderProps[ 'defaultOpen' ];
	/**
	 * The controlled open state of the menu popover. Must be used in conjunction
	 * with `onOpenChange`.
	 */
	open?: Ariakit.MenuProviderProps[ 'open' ];
	/**
	 * Event handler called when the open state of the menu popover changes.
	 */
	onOpenChange?: Ariakit.MenuProviderProps[ 'setOpen' ];
	/**
	 * The placement of the menu popover.
	 *
	 * @default 'bottom-start' for root-level menus, 'right-start' for nested menus
	 */
	placement?: Ariakit.MenuProviderProps[ 'placement' ];
}

export interface MenuPopoverProps {
	/**
	 * The contents of the dropdown.
	 */
	children?: Ariakit.MenuProps[ 'children' ];
	/**
	 * The modality of the menu popover. When set to true, interaction with
	 * outside elements will be disabled and only menu content will be visible to
	 * screen readers.
	 *
	 * @default true
	 */
	modal?: Ariakit.MenuProps[ 'modal' ];
	/**
	 * The distance between the popover and the anchor element.
	 *
	 * @default 8 for root-level menus, 16 for nested menus
	 */
	gutter?: Ariakit.MenuProps[ 'gutter' ];
	/**
	 * The skidding of the popover along the anchor element. Can be set to
	 * negative values to make the popover shift to the opposite side.
	 *
	 * @default 0 for root-level menus, -8 for nested menus
	 */
	shift?: Ariakit.MenuProps[ 'shift' ];
	/**
	 * Determines whether the menu popover will be hidden when the user presses
	 * the Escape key.
	 *
	 * @default `( event ) => { event.preventDefault(); return true; }`
	 */
	hideOnEscape?: Ariakit.MenuProps[ 'hideOnEscape' ];
}

export interface MenuTriggerButtonProps {
	/**
	 * The contents of the menu trigger button.
	 */
	children?: Ariakit.MenuButtonProps[ 'children' ];
	/**
	 * Allows the component to be rendered as a different HTML element or React
	 * component. The value can be a React element or a function that takes in the
	 * original component props and gives back a React element with the props
	 * merged.
	 */
	render?: Ariakit.MenuButtonProps[ 'render' ];
	/**
	 * Determines if the element is disabled. This sets the `aria-disabled`
	 * attribute accordingly, enabling support for all elements, including those
	 * that don't support the native `disabled` attribute.
	 *
	 * This feature can be combined with the `accessibleWhenDisabled` prop to
	 * make disabled elements still accessible via keyboard.
	 *
	 * **Note**: For this prop to work, the `focusable` prop must be set to
	 * `true`, if it's not set by default.
	 *
	 * @default false
	 */
	disabled?: Ariakit.MenuButtonProps[ 'disabled' ];
	/**
	 * Indicates whether the element should be focusable even when it is
	 * `disabled`.
	 *
	 * This is important when discoverability is a concern. For example:
	 *
	 * > A toolbar in an editor contains a set of special smart paste functions
	 * that are disabled when the clipboard is empty or when the function is not
	 * applicable to the current content of the clipboard. It could be helpful to
	 * keep the disabled buttons focusable if the ability to discover their
	 * functionality is primarily via their presence on the toolbar.
	 *
	 * Learn more on [Focusability of disabled
	 * controls](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#focusabilityofdisabledcontrols).
	 */
	accessibleWhenDisabled?: Ariakit.MenuButtonProps[ 'accessibleWhenDisabled' ];
}

export interface MenuGroupProps {
	/**
	 * The contents of the menu group (ie. an optional menu group label and one
	 * or more menu items).
	 */
	children: Ariakit.MenuGroupProps[ 'children' ];
}

export interface MenuGroupLabelProps {
	/**
	 * The contents of the menu group label.
	 */
	children: Ariakit.MenuGroupLabelProps[ 'children' ];
}

export interface MenuItemProps {
	/**
	 * The contents of the menu item.
	 */
	children: Ariakit.MenuItemProps[ 'children' ];
	/**
	 * The contents of the menu item's prefix.
	 */
	prefix?: React.ReactNode;
	/**
	 * The contents of the menu item's suffix.
	 */
	suffix?: React.ReactNode;
	/**
	 * Whether to hide the menu popover when the menu item is clicked.
	 *
	 * @default true
	 */
	hideOnClick?: Ariakit.MenuItemProps[ 'hideOnClick' ];
	/**
	 * Determines if the element is disabled.
	 */
	disabled?: Ariakit.MenuItemProps[ 'disabled' ];
	/**
	 * Allows the component to be rendered as a different HTML element or React
	 * component. The value can be a React element or a function that takes in the
	 * original component props and gives back a React element with the props
	 * merged.
	 */
	render?: Ariakit.MenuItemProps[ 'render' ];
	/**
	 * The ariakit store. This prop is only meant for internal use.
	 * @ignore
	 */
	store?: Ariakit.MenuItemProps[ 'store' ];
}

export interface MenuCheckboxItemProps {
	/**
	 * The contents of the menu item.
	 */
	children: Ariakit.MenuItemCheckboxProps[ 'children' ];
	/**
	 * The contents of the menu item's suffix.
	 */
	suffix?: React.ReactNode;
	/**
	 * Whether to hide the menu popover when the menu item is clicked.
	 *
	 * @default false
	 */
	hideOnClick?: Ariakit.MenuItemCheckboxProps[ 'hideOnClick' ];
	/**
	 * Determines if the element is disabled.
	 */
	disabled?: Ariakit.MenuItemCheckboxProps[ 'disabled' ];
	/**
	 * Allows the component to be rendered as a different HTML element or React
	 * component. The value can be a React element or a function that takes in the
	 * original component props and gives back a React element with the props
	 * merged.
	 */
	render?: Ariakit.MenuItemCheckboxProps[ 'render' ];
	/**
	 * The checkbox menu item's name.
	 */
	name: Ariakit.MenuItemCheckboxProps[ 'name' ];
	/**
	 * The checkbox item's value, useful when using multiple checkbox menu items
	 * associated to the same `name`.
	 */
	value?: Ariakit.MenuItemCheckboxProps[ 'value' ];
	/**
	 * The controlled checked state of the checkbox menu item.
	 */
	checked?: Ariakit.MenuItemCheckboxProps[ 'checked' ];
	/**
	 * The checked state of the checkbox menu item when it is initially rendered.
	 * Use when not wanting to control its checked state.
	 */
	defaultChecked?: Ariakit.MenuItemCheckboxProps[ 'defaultChecked' ];
	/**
	 * Event handler called when the checked state of the checkbox menu item changes.
	 */
	onChange?: Ariakit.MenuItemCheckboxProps[ 'onChange' ];
}

export interface MenuRadioItemProps {
	/**
	 * The contents of the menu item.
	 */
	children: Ariakit.MenuItemRadioProps[ 'children' ];
	/**
	 * The contents of the menu item's suffix.
	 */
	suffix?: React.ReactNode;
	/**
	 * Whether to hide the menu popover when the menu item is clicked.
	 *
	 * @default false
	 */
	hideOnClick?: Ariakit.MenuItemRadioProps[ 'hideOnClick' ];
	/**
	 * Determines if the element is disabled.
	 */
	disabled?: Ariakit.MenuItemRadioProps[ 'disabled' ];
	/**
	 * Allows the component to be rendered as a different HTML element or React
	 * component. The value can be a React element or a function that takes in the
	 * original component props and gives back a React element with the props
	 * merged.
	 */
	render?: Ariakit.MenuItemRadioProps[ 'render' ];
	/**
	 * The radio item's name.
	 */
	name: Ariakit.MenuItemRadioProps[ 'name' ];
	/**
	 * The radio item's value.
	 */
	value: Ariakit.MenuItemRadioProps[ 'value' ];
	/**
	 * The controlled checked state of the radio menu item.
	 */
	checked?: Ariakit.MenuItemRadioProps[ 'checked' ];
	/**
	 * The checked state of the radio menu item when it is initially rendered.
	 * Use when not wanting to control its checked state.
	 */
	defaultChecked?: Ariakit.MenuItemRadioProps[ 'defaultChecked' ];
	/**
	 * Event handler called when the checked radio menu item changes.
	 */
	onChange?: Ariakit.MenuItemRadioProps[ 'onChange' ];
}

export interface MenuSeparatorProps {}
