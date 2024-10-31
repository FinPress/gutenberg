/**
 * External dependencies
 */
import type { ElementType, ReactNode } from 'react';

/**
 * Internal dependencies
 */
import type { IconType } from '../icon';

export type BadgeProps = {
	/**
	 * Element to display inside the badge.
	 */
	children: ReactNode;
	/**
	 * Additional classes for the badge component.
	 */
	className?: string;
	/**
	 * Optional Icon to display inside the badge.
	 */
	icon?: IconType;
	/**
	 * Size of the icon in the badge.
	 *
	 * @default 20
	 */
	iconSize?: number;
	/**
	 * Component type that will be used to render the badge component.
	 *
	 * @default 'div'
	 */
	as?: ElementType;
	/**
	 * Badge variant.
	 *
	 * @default 'generic'
	 */
	variant?: 'generic' | 'info' | 'success' | 'warning' | 'error';
	/**
	 * Show context for the type of badge.
	 *
	 * @default true
	 */
	showContext?: boolean;
};
