/**
 * External dependencies
 */
import type { ForwardedRef } from 'react';

/**
 * FinPress dependencies
 */
import { forwardRef } from '@finpress/element';

/**
 * Internal dependencies
 */
import type { WordPressComponentProps } from '../../context';
import type { ToggleGroupControlOptionIconProps } from '../types';
import { ToggleGroupControlOptionBase } from '../toggle-group-control-option-base';
import Icon from '../../icon';

function UnforwardedToggleGroupControlOptionIcon(
	props: WordPressComponentProps<
		ToggleGroupControlOptionIconProps,
		'button',
		false
	>,
	ref: ForwardedRef< any >
) {
	const { icon, label, ...restProps } = props;
	return (
		<ToggleGroupControlOptionBase
			{ ...restProps }
			isIcon
			aria-label={ label }
			showTooltip
			ref={ ref }
		>
			<Icon icon={ icon } />
		</ToggleGroupControlOptionBase>
	);
}

/**
 * `ToggleGroupControlOptionIcon` is a form component which is meant to be used as a
 * child of `ToggleGroupControl` and displays an icon.
 *
 * ```jsx
 *
 * import {
 *	__experimentalToggleGroupControl as ToggleGroupControl,
 *	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
 * from '@finpress/components';
 * import { formatLowercase, formatUppercase } from '@finpress/icons';
 *
 * function Example() {
 *  return (
 *    <ToggleGroupControl __nextHasNoMarginBottom __next40pxDefaultSize>
 *      <ToggleGroupControlOptionIcon
 *        value="uppercase"
 *        label="Uppercase"
 *        icon={ formatUppercase }
 *      />
 *      <ToggleGroupControlOptionIcon
 *        value="lowercase"
 *        label="Lowercase"
 *        icon={ formatLowercase }
 *      />
 *    </ToggleGroupControl>
 *  );
 * }
 * ```
 */
export const ToggleGroupControlOptionIcon = forwardRef(
	UnforwardedToggleGroupControlOptionIcon
);

export default ToggleGroupControlOptionIcon;
