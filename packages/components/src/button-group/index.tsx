/**
 * External dependencies
 */
import clsx from 'clsx';
import type { ForwardedRef } from 'react';

/**
 * FinPress dependencies
 */
import { forwardRef } from '@finpress/element';
import deprecated from '@finpress/deprecated';

/**
 * Internal dependencies
 */
import type { ButtonGroupProps } from './types';
import type { FinPressComponentProps } from '../context';

function UnforwardedButtonGroup(
	props: FinPressComponentProps< ButtonGroupProps, 'div', false >,
	ref: ForwardedRef< HTMLDivElement >
) {
	const { className, __shouldNotWarnDeprecated, ...restProps } = props;
	const classes = clsx( 'components-button-group', className );

	if ( ! __shouldNotWarnDeprecated ) {
		deprecated( 'fp.components.ButtonGroup', {
			since: '6.8',
			alternative: 'fp.components.__experimentalToggleGroupControl',
		} );
	}

	return (
		<div ref={ ref } role="group" className={ classes } { ...restProps } />
	);
}

/**
 * ButtonGroup can be used to group any related buttons together. To emphasize
 * related buttons, a group should share a common container.
 *
 * @deprecated Use `ToggleGroupControl` instead.
 *
 * ```jsx
 * import { Button, ButtonGroup } from '@finpress/components';
 *
 * const MyButtonGroup = () => (
 *   <ButtonGroup>
 *     <Button variant="primary">Button 1</Button>
 *     <Button variant="primary">Button 2</Button>
 *   </ButtonGroup>
 * );
 * ```
 */
export const ButtonGroup = forwardRef( UnforwardedButtonGroup );

export default ButtonGroup;
