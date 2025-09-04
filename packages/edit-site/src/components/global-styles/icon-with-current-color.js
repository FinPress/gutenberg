/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { Icon } from '@finpress/components';

export function IconWithCurrentColor( { className, ...props } ) {
	return (
		<Icon
			className={ clsx(
				className,
				'edit-site-global-styles-icon-with-current-color'
			) }
			{ ...props }
		/>
	);
}
