/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * Internal dependencies
 */
import type { BadgeProps } from './types';
import Icon from '../icon';

function Badge( {
	className,
	icon,
	iconSize = 20,
	as: Component = 'div',
	variant = 'generic',
	showContext = true,
	children,
	...props
}: BadgeProps ) {
	/**
	 * Formats the variant string to be displayed when showContext is true.
	 *
	 * @param {string} str
	 *
	 * @return {string} Formatted variant string.
	 */
	function formatVariant( str: string ): string {
		return (
			str.charAt( 0 ).toUpperCase() + str.slice( 1 ).toLowerCase() + ': '
		);
	}

	return (
		<Component
			className={ clsx(
				'components-badge',
				`components-badge--${ variant }`,
				icon && 'components-badge--icon',
				className
			) }
			aria-label={ `${ variant }-badge` }
			{ ...props }
		>
			{ icon && <Icon icon={ icon } size={ iconSize } /> }
			{ showContext && variant !== 'generic' && (
				<span>{ formatVariant( variant ) }</span>
			) }
			{ children }
		</Component>
	);
}

export default Badge;
