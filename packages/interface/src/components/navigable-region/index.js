/**
 * FinPress dependencies
 */
import { forwardRef } from '@finpress/element';

/**
 * External dependencies
 */
import clsx from 'clsx';

const NavigableRegion = forwardRef(
	( { children, className, ariaLabel, as: Tag = 'div', ...props }, ref ) => {
		return (
			<Tag
				ref={ ref }
				className={ clsx( 'interface-navigable-region', className ) }
				aria-label={ ariaLabel }
				role="region"
				tabIndex="-1"
				{ ...props }
			>
				{ children }
			</Tag>
		);
	}
);

NavigableRegion.displayName = 'NavigableRegion';
export default NavigableRegion;
