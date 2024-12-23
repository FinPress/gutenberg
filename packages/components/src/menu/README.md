# Menu

<!-- This file is generated automatically and cannot be edited directly. Make edits via TypeScript types and TSDocs. -->

<p class="callout callout-info">See the <a href="https://wordpress.github.io/gutenberg/?path=/docs/components-menu--docs">WordPress Storybook</a> for more detailed, interactive documentation.</p>

## Props

### `as`

The HTML element or React component to render the component as.

 - Type: `"symbol" | "object" | "a" | "abbr" | "address" | "area" | "article" | "aside" | "audio" | "b" | "base" | "bdi" | "bdo" | "big" | "blockquote" | "body" | "br" | "button" | "canvas" | ... 516 more ... | ("view" & FunctionComponent<...>)`
 - Required: No

### `children`

The elements, which should include one instance of the `Menu.TriggerButton`
component and one instance of the `Menu.Popover` component.

 - Type: `ReactNode`
 - Required: No

### `defaultOpen`

Whether the menu popover and its contents should be visible by default.

Note: this prop will be overridden by the `open` prop if it is
provided (meaning the component will be used in "controlled" mode).

 - Type: `boolean`
 - Required: No
 - Default: `false`

### `open`

Whether the menu popover and its contents should be visible.
Should be used in conjunction with `onOpenChange` in order to control
the open state of the menu popover.

Note: this prop will set the component in "controlled" mode, and it will
override the `defaultOpen` prop.

 - Type: `boolean`
 - Required: No

### `onOpenChange`

A callback that gets called when the `open` state changes.

 - Type: `(open: boolean) => void`
 - Required: No

### `placement`

The placement of the menu popover.

 - Type: `"top" | "bottom" | "left" | "right" | "top-start" | "bottom-start" | "left-start" | "right-start" | "top-end" | "bottom-end" | ...`
 - Required: No
 - Default: `'bottom-start' for root-level menus, 'right-start' for submenus`

## Subcomponents

### Menu.TriggerButton

#### Props

##### `accessibleWhenDisabled`

Indicates whether the element should be focusable even when it is
`disabled`.

This is important when discoverability is a concern. For example:

> A toolbar in an editor contains a set of special smart paste functions
that are disabled when the clipboard is empty or when the function is not
applicable to the current content of the clipboard. It could be helpful to
keep the disabled buttons focusable if the ability to discover their
functionality is primarily via their presence on the toolbar.

Learn more on [Focusability of disabled
controls](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#focusabilityofdisabledcontrols).

 - Type: `boolean`
 - Required: No

##### `children`

The contents of the menu trigger button.

 - Type: `ReactNode`
 - Required: No

##### `disabled`

Determines if the element is disabled. This sets the `aria-disabled`
attribute accordingly, enabling support for all elements, including those
that don't support the native `disabled` attribute.

This feature can be combined with the `accessibleWhenDisabled` prop to
make disabled elements still accessible via keyboard.

 - Type: `boolean`
 - Required: No
 - Default: `false`

##### `render`

Allows the component to be rendered as a different HTML element or React
component. The value can be a React element or a function that takes in the
original component props and gives back a React element with the props
merged.

 - Type: `ReactElement<any, string | JSXElementConstructor<any>> | RenderProp<HTMLAttributes<any> & { ref?: Ref<any>; }>`
 - Required: No

### Menu.Popover

#### Props

##### `children`

The contents of the menu popover, which should include instances of the
`Menu.Item`, `Menu.CheckboxItem`, `Menu.RadioItem`, `Menu.Group`, and
`Menu.Separator` components.

 - Type: `ReactNode`
 - Required: No

##### `gutter`

The distance between the popover and the anchor element.

 - Type: `number`
 - Required: No
 - Default: `8 for root-level menus, 16 for nested menus`

##### `hideOnEscape`

Determines if the menu popover will hide when the user presses the
Escape key.

This prop can be either a boolean or a function that accepts an event as an
argument and returns a boolean. The event object represents the keydown
event that initiated the hide action, which could be either a native
keyboard event or a React synthetic event.

 - Type: `BooleanOrCallback<KeyboardEvent | React.KeyboardEvent<Element>>`
 - Required: No
 - Default: ``( event ) => { event.preventDefault(); return true; }``

##### `modal`

The modality of the menu popover. When set to true, interaction with
outside elements will be disabled and only menu content will be visible to
screen readers.

Determines whether the menu popover is modal. Modal dialogs have distinct
states and behaviors:
- The `portal` and `preventBodyScroll` props are set to `true`. They can
  still be manually set to `false`.
- When the dialog is open, element tree outside it will be inert.

 - Type: `boolean`
 - Required: No
 - Default: `true`

##### `shift`

The skidding of the popover along the anchor element. Can be set to
negative values to make the popover shift to the opposite side.

 - Type: `number`
 - Required: No
 - Default: `0 for root-level menus, -8 for nested menus`

### Menu.Item

#### Props

##### `children`

The contents of the menu item, which could include one instance of the
`Menu.ItemLabel` component and/or one instance of the `Menu.ItemHelpText`
component.

 - Type: `ReactNode`
 - Required: Yes

##### `disabled`

Determines if the element is disabled. This sets the `aria-disabled`
attribute accordingly, enabling support for all elements, including those
that don't support the native `disabled` attribute.

 - Type: `boolean`
 - Required: No
 - Default: `false`

##### `hideOnClick`

Determines if the menu should hide when this item is clicked.

**Note**: This behavior isn't triggered if this menu item is rendered as a
link and modifier keys are used to either open the link in a new tab or
download it.

 - Type: `BooleanOrCallback<MouseEvent<HTMLElement, MouseEvent>>`
 - Required: No
 - Default: `true`

##### `prefix`

The contents of the menu item's prefix, such as an icon.

 - Type: `ReactNode`
 - Required: No

##### `render`

Allows the component to be rendered as a different HTML element or React
component. The value can be a React element or a function that takes in the
original component props and gives back a React element with the props
merged.

 - Type: `ReactElement<any, string | JSXElementConstructor<any>> | RenderProp<HTMLAttributes<any> & { ref?: Ref<any>; }>`
 - Required: No

##### `suffix`

The contents of the menu item's suffix, such as a keyboard shortcut.

 - Type: `ReactNode`
 - Required: No

### Menu.RadioItem

#### Props

##### `children`

The contents of the menu item, which could include one instance of the
`Menu.ItemLabel` component and/or one instance of the `Menu.ItemHelpText`
component.

 - Type: `ReactNode`
 - Required: Yes

##### `checked`

The controlled checked state of the radio menu item.

Note: this prop will override the `defaultChecked` prop.

 - Type: `boolean`
 - Required: No

##### `disabled`

Determines if the element is disabled. This sets the `aria-disabled`
attribute accordingly, enabling support for all elements, including those
that don't support the native `disabled` attribute.

 - Type: `boolean`
 - Required: No
 - Default: `false`

##### `defaultChecked`

The checked state of the radio menu item when it is initially rendered.
Use when not wanting to control its checked state.

Note: this prop will be overriden by the `checked` prop, if it is defined.

 - Type: `boolean`
 - Required: No

##### `hideOnClick`

Determines if the menu should hide when this item is clicked.

**Note**: This behavior isn't triggered if this menu item is rendered as a
link and modifier keys are used to either open the link in a new tab or
download it.

 - Type: `BooleanOrCallback<MouseEvent<HTMLElement, MouseEvent>>`
 - Required: No
 - Default: `false`

##### `name`

The radio item's name.

 - Type: `string`
 - Required: Yes

##### `onChange`

A function that is called when the checkbox's checked state changes.

 - Type: `BivariantCallback<(event: ChangeEvent<HTMLInputElement>) => void>`
 - Required: No

##### `render`

Allows the component to be rendered as a different HTML element or React
component. The value can be a React element or a function that takes in the
original component props and gives back a React element with the props
merged.

 - Type: `ReactElement<any, string | JSXElementConstructor<any>> | RenderProp<HTMLAttributes<any> & { ref?: Ref<any>; }>`
 - Required: No

##### `suffix`

The contents of the menu item's suffix, such as a keyboard shortcut.

 - Type: `ReactNode`
 - Required: No

##### `value`

The radio item's value.

 - Type: `string | number`
 - Required: Yes

### Menu.CheckboxItem

#### Props

##### `children`

The contents of the menu item, which could include one instance of the
`Menu.ItemLabel` component and/or one instance of the `Menu.ItemHelpText`
component.

 - Type: `ReactNode`
 - Required: Yes

##### `checked`

The controlled checked state of the checkbox menu item.

Note: this prop will override the `defaultChecked` prop.

 - Type: `boolean`
 - Required: No

##### `disabled`

Determines if the element is disabled. This sets the `aria-disabled`
attribute accordingly, enabling support for all elements, including those
that don't support the native `disabled` attribute.

 - Type: `boolean`
 - Required: No
 - Default: `false`

##### `defaultChecked`

The checked state of the checkbox menu item when it is initially rendered.
Use when not wanting to control its checked state.

Note: this prop will be overriden by the `checked` prop, if it is defined.

 - Type: `boolean`
 - Required: No

##### `hideOnClick`

Determines if the menu should hide when this item is clicked.

**Note**: This behavior isn't triggered if this menu item is rendered as a
link and modifier keys are used to either open the link in a new tab or
download it.

 - Type: `BooleanOrCallback<MouseEvent<HTMLElement, MouseEvent>>`
 - Required: No
 - Default: `false`

##### `name`

The checkbox menu item's name.

 - Type: `string`
 - Required: Yes

##### `onChange`

A function that is called when the checkbox's checked state changes.

 - Type: `ChangeEventHandler<HTMLInputElement>`
 - Required: No

##### `render`

Allows the component to be rendered as a different HTML element or React
component. The value can be a React element or a function that takes in the
original component props and gives back a React element with the props
merged.

 - Type: `ReactElement<any, string | JSXElementConstructor<any>> | RenderProp<HTMLAttributes<any> & { ref?: Ref<any>; }>`
 - Required: No

##### `suffix`

The contents of the menu item's suffix, such as a keyboard shortcut.

 - Type: `ReactNode`
 - Required: No

##### `value`

The checkbox item's value, useful when using multiple checkbox menu items
associated to the same `name`.

 - Type: `string | number | readonly string[]`
 - Required: No

### Menu.ItemLabel

#### Props

##### `as`

The HTML element or React component to render the component as.

 - Type: `"symbol" | "object" | "a" | "abbr" | "address" | "area" | "article" | "aside" | "audio" | "b" | ...`
 - Required: No

### Menu.ItemHelpText

#### Props

##### `as`

The HTML element or React component to render the component as.

 - Type: `"symbol" | "object" | "a" | "abbr" | "address" | "area" | "article" | "aside" | "audio" | "b" | ...`
 - Required: No

### Menu.Group

#### Props

##### `children`

The contents of the menu group, which should include one instance of the
`Menu.GroupLabel` component and one or more instances of `Menu.Item`,
`Menu.CheckboxItem`, and `Menu.RadioItem`.

 - Type: `ReactNode`
 - Required: Yes

### Menu.GroupLabel

#### Props

##### `children`

The contents of the menu group label, which should provide an accessible
label for the menu group.

 - Type: `ReactNode`
 - Required: Yes

### Menu.Separator

#### Props

### Menu.SubmenuTriggerItem

#### Props

##### `children`

The contents of the menu item, which could include one instance of the
`Menu.ItemLabel` component and/or one instance of the `Menu.ItemHelpText`
component.

 - Type: `ReactNode`
 - Required: Yes

##### `disabled`

Determines if the element is disabled. This sets the `aria-disabled`
attribute accordingly, enabling support for all elements, including those
that don't support the native `disabled` attribute.

 - Type: `boolean`
 - Required: No
 - Default: `false`

##### `hideOnClick`

Determines if the menu should hide when this item is clicked.

**Note**: This behavior isn't triggered if this menu item is rendered as a
link and modifier keys are used to either open the link in a new tab or
download it.

 - Type: `BooleanOrCallback<MouseEvent<HTMLElement, MouseEvent>>`
 - Required: No
 - Default: `true`

##### `prefix`

The contents of the menu item's prefix, such as an icon.

 - Type: `ReactNode`
 - Required: No

##### `render`

Allows the component to be rendered as a different HTML element or React
component. The value can be a React element or a function that takes in the
original component props and gives back a React element with the props
merged.

 - Type: `ReactElement<any, string | JSXElementConstructor<any>> | RenderProp<HTMLAttributes<any> & { ref?: Ref<any>; }>`
 - Required: No

##### `suffix`

The contents of the menu item's suffix, such as a keyboard shortcut.

 - Type: `ReactNode`
 - Required: No
