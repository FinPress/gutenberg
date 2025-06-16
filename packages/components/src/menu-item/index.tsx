/**
 * External dependencies
 */
import type { ForwardedRef } from 'react';
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { cloneElement, forwardRef } from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import Shortcut from '../shortcut';
import Button from '../button';
import Icon from '../icon';
import type { WordPressComponentProps } from '../context';
import type { MenuItemProps } from './types';

function UnforwardedMenuItem(
	props: WordPressComponentProps< MenuItemProps, 'button', false >,
	ref: ForwardedRef< HTMLButtonElement >
) {
	let {
		children,
		info,
		className,
		icon,
		iconPosition = 'right',
		shortcut,
		isSelected,
		role = 'menuitem',
		suffix,
		...restProps
	} = props;

	className = clsx( 'components-menu-item__button', className );

	const descriptionId = useInstanceId(
		UnforwardedMenuItem,
		'menu-item-description'
	);

	const buttonProps = {
		...( info ? { 'aria-describedby': descriptionId } : {} ),
		...restProps,
	};

	if ( info ) {
		children = (
			<span className="components-menu-item__info-wrapper">
				<span className="components-menu-item__item">{ children }</span>
				<span className="components-menu-item__info" aria-hidden="true">
					{ info }
				</span>
			</span>
		);
	}

	if ( icon && typeof icon !== 'string' ) {
		icon = cloneElement( icon, {
			className: clsx( 'components-menu-items__item-icon', {
				'has-icon-right': iconPosition === 'right',
			} ),
		} );
	}

	return (
		<>
			<Button
				__next40pxDefaultSize
				ref={ ref }
				aria-checked={
					role === 'menuitemcheckbox' || role === 'menuitemradio'
						? isSelected
						: undefined
				}
				role={ role }
				icon={ iconPosition === 'left' ? icon : undefined }
				className={ className }
				{ ...buttonProps }
			>
				{ children }
				{ ! suffix && (
					<Shortcut
						className="components-menu-item__shortcut"
						shortcut={ shortcut }
					/>
				) }
				{ ! suffix && icon && iconPosition === 'right' && (
					<Icon icon={ icon } />
				) }
				{ suffix }
			</Button>
			{ info && (
				<span id={ descriptionId } className="screen-reader-text">
					{ info }
				</span>
			) }
		</>
	);
}

/**
 * MenuItem is a component which renders a button intended to be used in combination with the `DropdownMenu` component.
 *
 * ```jsx
 * import { MenuItem } from '@wordpress/components';
 * import { useState } from '@wordpress/element';
 *
 * const MyMenuItem = () => {
 * 	const [ isActive, setIsActive ] = useState( true );
 *
 * 	return (
 * 		<MenuItem
 * 			icon={ isActive ? 'yes' : 'no' }
 * 			isSelected={ isActive }
 * 			role="menuitemcheckbox"
 * 			onClick={ () => setIsActive( ( state ) => ! state ) }
 * 		>
 * 			Toggle
 * 		</MenuItem>
 * 	);
 * };
 * ```
 */
export const MenuItem = forwardRef( UnforwardedMenuItem );

export default MenuItem;
