/**
 * External dependencies
 */
import type { ElementType, ReactNode } from 'react';

export type BadgeProps = {
	/**
	 * Additional classes for the badge component.
	 */
	className?: string;
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
	context?: 'neutral' | 'info' | 'success' | 'warning' | 'error';
	/**
	 * Element to display inside the badge.
	 */
	children: ReactNode;
};
