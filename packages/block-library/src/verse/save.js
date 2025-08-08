/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	RichText,
	useBlockProps,
	getColorClassName,
} from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const {
		textAlign,
		content,
		style,
		dimRatio = 50,
		overlayColor,
		customOverlayColor,
	} = attributes;

	const hasBackgroundImage = style?.background?.backgroundImage;
	const overlayColorClass = getColorClassName(
		'background-color',
		overlayColor
	);

	const className = clsx( {
		[ `has-text-align-${ textAlign }` ]: textAlign,
		'has-background-dim':
			hasBackgroundImage && ( overlayColor || customOverlayColor ),
		[ `has-background-dim-${ dimRatio }` ]:
			hasBackgroundImage && ( overlayColor || customOverlayColor ),
		[ overlayColorClass ]: hasBackgroundImage && overlayColorClass,
	} );

	const overlayStyle =
		hasBackgroundImage && ( overlayColor || customOverlayColor )
			? {
					'--wp-verse-overlay-color':
						customOverlayColor ||
						`var(--wp--preset--color--${ overlayColor })`,
			  }
			: {};

	return (
		<pre
			{ ...useBlockProps.save( {
				className,
				style: {
					...overlayStyle,
				},
			} ) }
		>
			<RichText.Content value={ content } />
		</pre>
	);
}
