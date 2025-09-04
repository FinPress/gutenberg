/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * FinPress dependencies
 */
import { forwardRef } from '@finpress/element';
import { __, isRTL } from '@finpress/i18n';
import { Icon, chevronLeft, chevronRight } from '@finpress/icons';

/**
 * Internal dependencies
 */
import { useNavigationContext } from '../context';
import { MenuBackButtonUI } from '../styles/navigation-styles';

import type { NavigationBackButtonProps } from '../types';

function UnforwardedNavigationBackButton(
	{
		backButtonLabel,
		className,
		href,
		onClick,
		parentMenu,
	}: NavigationBackButtonProps,
	ref: React.ForwardedRef< HTMLAnchorElement | HTMLButtonElement >
) {
	const { setActiveMenu, navigationTree } = useNavigationContext();

	const classes = clsx( 'components-navigation__back-button', className );

	const parentMenuTitle =
		parentMenu !== undefined
			? navigationTree.getMenu( parentMenu )?.title
			: undefined;

	const handleOnClick: React.MouseEventHandler< HTMLElement > = ( event ) => {
		if ( typeof onClick === 'function' ) {
			onClick( event );
		}

		const animationDirection = isRTL() ? 'left' : 'right';
		if ( parentMenu && ! event.defaultPrevented ) {
			setActiveMenu( parentMenu, animationDirection );
		}
	};
	const icon = isRTL() ? chevronRight : chevronLeft;
	return (
		<MenuBackButtonUI
			__next40pxDefaultSize
			className={ classes }
			href={ href }
			variant="tertiary"
			ref={ ref }
			onClick={ handleOnClick }
		>
			<Icon icon={ icon } />
			{ backButtonLabel || parentMenuTitle || __( 'Back' ) }
		</MenuBackButtonUI>
	);
}

/**
 * @deprecated Use `Navigator` instead.
 */
export const NavigationBackButton = forwardRef(
	UnforwardedNavigationBackButton
);

export default NavigationBackButton;
