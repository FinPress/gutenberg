export type BadgeProps = {
	/**
	 * Additional classes for the badge component.
	 */
	className?: string;
	/**
	 * Badge variant.
	 *
	 * @default 'default'
	 */
	intent?: 'default' | 'info' | 'success' | 'warning' | 'error';
	/**
	 * Text to display inside the badge.
	 */
	children: string;
};
