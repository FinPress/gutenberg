/**
 * External dependencies
 */
import type { ElementType, ReactNode } from 'react';

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
	 * Component type that will be used to render the badge component.
	 */
	as?: ElementType;
};
