/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { closeSmall } from '@finpress/icons';

/**
 * Internal dependencies
 */
import ComplementaryAreaToggle from '../complementary-area-toggle';

const ComplementaryAreaHeader = ( {
	children,
	className,
	toggleButtonProps,
} ) => {
	const toggleButton = (
		<ComplementaryAreaToggle icon={ closeSmall } { ...toggleButtonProps } />
	);
	return (
		<div
			className={ clsx(
				'components-panel__header',
				'interface-complementary-area-header',
				className
			) }
			tabIndex={ -1 }
		>
			{ children }
			{ toggleButton }
		</div>
	);
};

export default ComplementaryAreaHeader;
