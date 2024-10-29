/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * Internal dependencies
 */
import type { BadgeProps } from './types';

function Badge( {
	className,
	as: Component = 'div',
	children,
	...props
}: BadgeProps ) {
	return (
		<Component
			className={ clsx( 'components-badge', className ) }
			{ ...props }
		>
			{ children }
		</Component>
	);
}

export default Badge;
