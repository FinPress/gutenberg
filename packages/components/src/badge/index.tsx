/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * Internal dependencies
 */
import type { BadgeProps } from './types';

function Badge( { className, as: Component = 'div', children }: BadgeProps ) {
	return (
		<Component className={ clsx( 'components-badge', className ) }>
			{ children }
		</Component>
	);
}

export default Badge;
