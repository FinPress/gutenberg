/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { Flex } from '@finpress/components';

function ColorIndicatorWrapper( { className, ...props } ) {
	return (
		<Flex
			className={ clsx(
				'edit-site-global-styles__color-indicator-wrapper',
				className
			) }
			{ ...props }
		/>
	);
}

export default ColorIndicatorWrapper;
