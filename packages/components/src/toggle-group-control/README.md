# ToggleGroupControl

<!-- This file is generated automatically and cannot be edited directly. Make edits via TypeScript types and TSDocs. -->

<p class="callout callout-info">See the <a href="https://wordpress.github.io/gutenberg/?path=/docs/components-togglegroupcontrol--docs">WordPress Storybook</a> for more detailed, interactive documentation.</p>

ToggleGroupControl is a form component that lets users choose options
from a group of toggle buttons. It provides a single-selection interface
with a consistent visual design.

## Props

### `__nextHasNoMarginBottom`

 - Type: `boolean`
 - Required: No
 - Default: `false`

Start opting into the new margin-free styles that will become the default in a future version.

### `__next40pxDefaultSize`

 - Type: `boolean`
 - Required: No
 - Default: `false`

Start opting into the larger default height that will become the default size in a future version.

### `children`

 - Type: `ReactNode`
 - Required: Yes

The options to render in the `ToggleGroupControl`, using either the `ToggleGroupControlOption` or
`ToggleGroupControlOptionIcon` components.

### `help`

 - Type: `ReactNode`
 - Required: No

Additional description for the control.

Only use for meaningful description or instructions for the control. An element containing the description will be programmatically associated to the BaseControl by the means of an `aria-describedby` attribute.

### `hideLabelFromVision`

 - Type: `boolean`
 - Required: No
 - Default: `false`

If true, the label will only be visible to screen readers.

### `isAdaptiveWidth`

 - Type: `boolean`
 - Required: No
 - Default: `false`

Determines if segments should be rendered with equal widths.

### `isBlock`

 - Type: `boolean`
 - Required: No
 - Default: `false`

Renders `ToggleGroupControl` as a (CSS) block element, spanning the entire width of
the available space. This is the recommended style when the options are text-based and not icons.

### `isDeselectable`

 - Type: `boolean`
 - Required: No
 - Default: `false`

Whether an option can be deselected by clicking it again.

### `label`

 - Type: `string`
 - Required: Yes

Label for the control.

### `onChange`

 - Type: `(value: string | number) => void`
 - Required: No

Callback when a segment is selected.

### `size`

 - Type: `"default" | "__unstable-large"`
 - Required: No
 - Default: `'default'`

The size variant of the control.

### `value`

 - Type: `string | number`
 - Required: No

The selected value.

## Subcomponents

### ToggleGroupControl.Option

#### Props

##### `label`

 - Type: `string`
 - Required: Yes

Label for the option. If needed, the `aria-label` prop can be used in addition
to specify a different label for assistive technologies.

##### `showTooltip`

 - Type: `boolean`
 - Required: No
 - Default: `false`

Whether to display a Tooltip for the control option. If set to `true`, the tooltip will
show the aria-label or the label prop text.

##### `value`

 - Type: `string | number`
 - Required: Yes

### ToggleGroupControl.OptionIcon

#### Props

##### `icon`

 - Type: `Element`
 - Required: Yes

Icon displayed as the content of the option. Usually one of the icons from
the `@wordpress/icons` package, or a custom React `<svg>` icon.

##### `label`

 - Type: `string`
 - Required: Yes

The text to accessibly label the icon option. Will also be shown in a tooltip.

##### `value`

 - Type: `string | number`
 - Required: Yes
