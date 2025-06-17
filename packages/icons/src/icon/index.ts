/**
 * WordPress dependencies
 */
import { cloneElement, forwardRef } from '@wordpress/element';

/**
 * External dependencies
 */
import type { ReactElement, ForwardedRef } from 'react';
import type { SVGProps } from '@wordpress/primitives';

export interface IconProps extends SVGProps {
	icon: ReactElement;
	size?: number;
}

/**
 * Return an SVG icon.
 *
 * @param props      icon is the SVG component to render
 *                   size is a number specifying the icon size in pixels
 *                   Other props will be passed to wrapped SVG component
 * @param props.icon The SVG component to render.
 * @param props.size The size of the icon in pixels, default is 24.
 * @param ref        The forwarded ref to the SVG element.
 *
 * @return Icon component
 */
function Icon(
	{ icon, size = 24, ...props }: IconProps,
	ref: ForwardedRef< HTMLElement >
): ReactElement {
	return cloneElement( icon, {
		width: size,
		height: size,
		...props,
		ref,
	} );
}

export default forwardRef( Icon );
