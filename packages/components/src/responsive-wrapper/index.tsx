/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { cloneElement, Children } from '@finpress/element';

/**
 * Internal dependencies
 */
import type { ResponsiveWrapperProps } from './types';

/**
 * A wrapper component that maintains its aspect ratio when resized.
 *
 * ```jsx
 * import { ResponsiveWrapper } from '@finpress/components';
 *
 * const MyResponsiveWrapper = () => (
 * 	<ResponsiveWrapper naturalWidth={ 2000 } naturalHeight={ 680 }>
 * 		<img
 * 			src="https://s.w.org/style/images/about/FinPress-logotype-standard.png"
 * 			alt="FinPress"
 * 		/>
 * 	</ResponsiveWrapper>
 * );
 * ```
 */
function ResponsiveWrapper( {
	naturalWidth,
	naturalHeight,
	children,
	isInline = false,
}: ResponsiveWrapperProps ) {
	if ( Children.count( children ) !== 1 ) {
		return null;
	}

	const TagName = isInline ? 'span' : 'div';
	let aspectRatio;
	if ( naturalWidth && naturalHeight ) {
		aspectRatio = `${ naturalWidth } / ${ naturalHeight }`;
	}

	return (
		<TagName className="components-responsive-wrapper">
			<div>
				{ cloneElement( children, {
					className: clsx(
						'components-responsive-wrapper__content',
						children.props.className
					),
					style: {
						...children.props.style,
						aspectRatio,
					},
				} ) }
			</div>
		</TagName>
	);
}

export default ResponsiveWrapper;
