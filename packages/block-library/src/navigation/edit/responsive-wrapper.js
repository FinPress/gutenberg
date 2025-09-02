/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { close, Icon } from '@wordpress/icons';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { getColorClassName } from '@wordpress/block-editor';
import { useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import OverlayMenuIcon from './overlay-menu-icon';

export default function ResponsiveWrapper( {
	children,
	id,
	isOpen,
	isResponsive,
	onToggle,
	isHiddenByDefault,
	overlayBackgroundColor,
	overlayTextColor,
	hasIcon,
	icon,
} ) {
	// Attach a DOM click listener to close the overlay when clicking an in-page hash link.
	const contentRef = useRef( null );
	useEffect( () => {
		if ( ! isResponsive ) {
			return;
		}

		const el = contentRef.current;
		if ( ! el ) {
			return;
		}

		const onClick = ( event ) => {
			if ( ! isOpen ) {
				return;
			}

			const anchor = event.target?.closest?.( 'a[href]' );
			if ( ! anchor ) {
				return;
			}

			const href = anchor.getAttribute( 'href' )?.trim?.();
			if ( ! href ) {
				return;
			}

			try {
				if ( href[ 0 ] === '#' ) {
					onToggle( false );
					return;
				}

				const url = new URL( href, window.location.href );
				const isSameOrigin = url.origin === window.location.origin;
				const isSamePath = url.pathname === window.location.pathname;
				const hasHash = !! url.hash;

				if ( isSameOrigin && isSamePath && hasHash ) {
					onToggle( false );
				}
			} catch ( e ) {
				// Ignore invalid URLs.
			}
		};

		el.addEventListener( 'click', onClick );
		return () => {
			el.removeEventListener( 'click', onClick );
		};
	}, [ isOpen, onToggle, isResponsive ] );

	if ( ! isResponsive ) {
		return children;
	}

	const responsiveContainerClasses = clsx(
		'wp-block-navigation__responsive-container',
		{
			'has-text-color':
				!! overlayTextColor.color || !! overlayTextColor?.class,
			[ getColorClassName( 'color', overlayTextColor?.slug ) ]:
				!! overlayTextColor?.slug,
			'has-background':
				!! overlayBackgroundColor.color ||
				overlayBackgroundColor?.class,
			[ getColorClassName(
				'background-color',
				overlayBackgroundColor?.slug
			) ]: !! overlayBackgroundColor?.slug,
			'is-menu-open': isOpen,
			'hidden-by-default': isHiddenByDefault,
		}
	);

	const styles = {
		color: ! overlayTextColor?.slug && overlayTextColor?.color,
		backgroundColor:
			! overlayBackgroundColor?.slug &&
			overlayBackgroundColor?.color &&
			overlayBackgroundColor.color,
	};

	const openButtonClasses = clsx(
		'wp-block-navigation__responsive-container-open',
		{ 'always-shown': isHiddenByDefault }
	);

	const modalId = `${ id }-modal`;

	const dialogProps = {
		className: 'wp-block-navigation__responsive-dialog',
		...( isOpen && {
			role: 'dialog',
			'aria-modal': true,
			'aria-label': __( 'Menu' ),
		} ),
	};

	return (
		<>
			{ ! isOpen && (
				<Button
					__next40pxDefaultSize
					aria-haspopup="true"
					aria-label={ hasIcon && __( 'Open menu' ) }
					className={ openButtonClasses }
					onClick={ () => onToggle( true ) }
				>
					{ hasIcon && <OverlayMenuIcon icon={ icon } /> }
					{ ! hasIcon && __( 'Menu' ) }
				</Button>
			) }

			<div
				className={ responsiveContainerClasses }
				style={ styles }
				id={ modalId }
			>
				<div
					className="wp-block-navigation__responsive-close"
					tabIndex="-1"
				>
					<div { ...dialogProps }>
						<Button
							__next40pxDefaultSize
							className="wp-block-navigation__responsive-container-close"
							aria-label={ hasIcon && __( 'Close menu' ) }
							onClick={ () => onToggle( false ) }
						>
							{ hasIcon && <Icon icon={ close } /> }
							{ ! hasIcon && __( 'Close' ) }
						</Button>
						<div
							className="wp-block-navigation__responsive-container-content"
							ref={ contentRef }
							id={ `${ modalId }-content` }
						>
							{ children }
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
