/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const {
		content,
		buttonPosition,
		scrollOffset,
		scrollDuration,
		smoothScroll,
		hasIcon,
		iconName,
		iconPosition,
		showText,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: `wp-block-back-to-top align-${ buttonPosition }`,
		'data-scroll-offset': scrollOffset,
		'data-scroll-duration': scrollDuration,
		'data-smooth-scroll': smoothScroll,
	} );

	const buttonContent = (
		<>
			{ hasIcon && iconPosition === 'before' && (
				<span
					className={ `dashicon dashicons dashicons-${ iconName }` }
				/>
			) }
			{ showText && (
				<span className="wp-block-back-to-top-text">{ content }</span>
			) }
			{ hasIcon && iconPosition === 'after' && (
				<span
					className={ `dashicon dashicons dashicons-${ iconName }` }
				/>
			) }
		</>
	);

	return (
		<button { ...blockProps } type="button">
			{ buttonContent }
		</button>
	);
}
