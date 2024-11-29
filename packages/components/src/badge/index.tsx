/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { info, caution, error, published } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import type { BadgeProps } from './types';
import Icon from '../icon';

function Badge( {
	className,
	as: Component = 'div',
	context = 'neutral',
	children,
	...props
}: BadgeProps ) {
	/**
	 * Returns an icon based on the badge context.
	 *
	 * @return {JSX.Element | null} The corresponding icon for the provided context.
	 */
	function contextBasedIcon(): JSX.Element | null {
		switch ( context ) {
			case 'info':
				return info;
			case 'warning':
				return caution;
			case 'error':
				return error;
			case 'success':
				return published;
			default:
				return null;
		}
	}

	return (
		<Component
			className={ clsx(
				'components-badge',
				`components-badge--${ context }`,
				context !== 'neutral' && 'components-badge--has-icon',
				className
			) }
			aria-label={ `${ context }-badge` }
			{ ...props }
		>
			{ context !== 'neutral' && (
				<Icon
					icon={ contextBasedIcon() }
					size={ 20 }
					fill="currentColor"
				/>
			) }
			{ children }
		</Component>
	);
}

export default Badge;
