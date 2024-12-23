/**
 * External dependencies
 */
import * as Ariakit from '@ariakit/react';

/**
 * WordPress dependencies
 */
import { useContext, useMemo } from '@wordpress/element';
import { isRTL as isRTLFn } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useContextSystem, contextConnectWithoutRef } from '../context';
import type { MenuContext as MenuContextType, MenuProps } from './types';
import { MenuContext } from './context';
import { MenuItem } from './item';
import { MenuCheckboxItem } from './checkbox-item';
import { MenuRadioItem } from './radio-item';
import { MenuGroup } from './group';
import { MenuGroupLabel } from './group-label';
import { MenuSeparator } from './separator';
import { MenuItemLabel } from './item-label';
import { MenuItemHelpText } from './item-help-text';
import { MenuTriggerButton } from './trigger-button';
import { MenuSubmenuTriggerItem } from './submenu-trigger-item';
import { MenuPopover } from './popover';

/**
 * Menu is a collection of React components that combine to render
 * ARIA-compliant [menu](https://www.w3.org/WAI/ARIA/apg/patterns/menu/) and
 * [menu button](https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/) patterns.
 *
 * `Menu` itself is a wrapper component and context provider.
 * It is responsible for managing the state of the menu and its items, and for
 * rendering the `Menu.TriggerButton` (or the `Menu.SubmenuTriggerItem`)
 * component, and the `Menu.Popover` component.
 */
const UnconnectedMenu = ( props: MenuProps ) => {
	const {
		children,
		defaultOpen = false,
		open,
		onOpenChange,
		placement,

		// From internal components context
		variant,
	} = useContextSystem<
		// @ts-expect-error TODO: missing 'className' in MenuProps
		typeof props & Pick< MenuContextType, 'variant' >
	>( props, 'Menu' );

	const parentContext = useContext( MenuContext );

	const rtl = isRTLFn();

	// If an explicit value for the `placement` prop is not passed,
	// apply a default placement of `bottom-start` for the root menu popover,
	// and of `right-start` for nested menu popovers.
	let computedPlacement =
		placement ?? ( parentContext?.store ? 'right-start' : 'bottom-start' );
	// Swap left/right in case of RTL direction
	if ( rtl ) {
		if ( /right/.test( computedPlacement ) ) {
			computedPlacement = computedPlacement.replace(
				'right',
				'left'
			) as typeof computedPlacement;
		} else if ( /left/.test( computedPlacement ) ) {
			computedPlacement = computedPlacement.replace(
				'left',
				'right'
			) as typeof computedPlacement;
		}
	}

	const menuStore = Ariakit.useMenuStore( {
		parent: parentContext?.store,
		open,
		defaultOpen,
		placement: computedPlacement,
		focusLoop: true,
		setOpen( willBeOpen ) {
			onOpenChange?.( willBeOpen );
		},
		rtl,
	} );

	const contextValue = useMemo(
		() => ( { store: menuStore, variant } ),
		[ menuStore, variant ]
	);

	return (
		<MenuContext.Provider value={ contextValue }>
			{ children }
		</MenuContext.Provider>
	);
};

/**
 * Menu is a collection of React components that combine to render
 * ARIA-compliant [menu](https://www.w3.org/WAI/ARIA/apg/patterns/menu/) and
 * [menu button](https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/) patterns.
 *
 * `Menu` itself is a wrapper component and context provider.
 * It is responsible for managing the state of the menu and its items, and for
 * rendering the `Menu.TriggerButton` (or the `Menu.SubmenuTriggerItem`)
 * component, and the `Menu.Popover` component.
 */
export const Menu = Object.assign(
	contextConnectWithoutRef( UnconnectedMenu, 'Menu' ),
	{
		Context: Object.assign( MenuContext, {
			displayName: 'Menu.Context',
		} ),
		/**
		 * Renders a menu item inside the `Menu.Popover` or `Menu.Group` components.
		 *
		 * It can optionally contain one instance of the `Menu.ItemLabel` component
		 * and one instance of the `Menu.ItemHelpText` component.
		 */
		Item: Object.assign( MenuItem, {
			displayName: 'Menu.Item',
		} ),
		/**
		 * Renders a radio menu item inside the `Menu.Popover` or `Menu.Group`
		 * components.
		 *
		 * It can optionally contain one instance of the `Menu.ItemLabel` component
		 * and one instance of the `Menu.ItemHelpText` component.
		 */
		RadioItem: Object.assign( MenuRadioItem, {
			displayName: 'Menu.RadioItem',
		} ),
		/**
		 * Renders a checkbox menu item inside the `Menu.Popover` or `Menu.Group`
		 * components.
		 *
		 * It can optionally contain one instance of the `Menu.ItemLabel` component
		 * and one instance of the `Menu.ItemHelpText` component.
		 */
		CheckboxItem: Object.assign( MenuCheckboxItem, {
			displayName: 'Menu.CheckboxItem',
		} ),
		/**
		 * Renders a group for menu items.
		 *
		 * It should contain one instance of `Menu.GroupLabel` and one or more
		 * instances of `Menu.Item`, `Menu.RadioItem`, or `Menu.CheckboxItem`.
		 */
		Group: Object.assign( MenuGroup, {
			displayName: 'Menu.Group',
		} ),
		/**
		 * Renders a label in a menu group.
		 *
		 * This component should be wrapped with `Menu.Group` so the
		 * `aria-labelledby` is correctly set on the group element.
		 */
		GroupLabel: Object.assign( MenuGroupLabel, {
			displayName: 'Menu.GroupLabel',
		} ),
		/**
		 * Renders a divider between menu items or menu groups.
		 */
		Separator: Object.assign( MenuSeparator, {
			displayName: 'Menu.Separator',
		} ),
		/**
		 * Renders a menu item's label text. It should be wrapped with `Menu.Item`,
		 * `Menu.RadioItem`, or `Menu.CheckboxItem`.
		 */
		ItemLabel: Object.assign( MenuItemLabel, {
			displayName: 'Menu.ItemLabel',
		} ),
		/**
		 * Renders a menu item's help text. It should be wrapped with `Menu.Item`,
		 * `Menu.RadioItem`, or `Menu.CheckboxItem`.
		 */
		ItemHelpText: Object.assign( MenuItemHelpText, {
			displayName: 'Menu.ItemHelpText',
		} ),
		/**
		 * Renders a dropdown menu element that's controlled by a sibling
		 * `Menu.TriggerButton` component. It renders a popover and automatically
		 * focuses on items when the menu is shown.
		 *
		 * The only valid children of `Menu.Popover` are `Menu.Item`,
		 * `Menu.RadioItem`, `Menu.CheckboxItem`, `Menu.Group`, `Menu.Separator`,
		 * and `Menu` (for nested dropdown menus).
		 */
		Popover: Object.assign( MenuPopover, {
			displayName: 'Menu.Popover',
		} ),
		/**
		 * Renders a menu button that toggles the visibility of a sibling
		 * `Menu.Popover` component when clicked or when using arrow keys.
		 */
		TriggerButton: Object.assign( MenuTriggerButton, {
			displayName: 'Menu.TriggerButton',
		} ),
		/**
		 * Renders a menu item that toggles the visibility of a sibling
		 * `Menu.Popover` component when clicked or when using arrow keys.
		 *
		 * This component is used to create a nested dropdown menu.
		 */
		SubmenuTriggerItem: Object.assign( MenuSubmenuTriggerItem, {
			displayName: 'Menu.SubmenuTriggerItem',
		} ),
	}
);

export default Menu;
