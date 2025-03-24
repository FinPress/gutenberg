/**
 * WordPress dependencies
 */
import { useBlockProps, getSpacingPresetCssVar } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { heightMobile, heightTablet, heightDesktop, width, style } =
		attributes;
	const { layout: { selfStretch } = {} } = style || {};

	const heights = {
		'--wp-block-spacing-height-mobile':
			getSpacingPresetCssVar( heightMobile ),
		'--wp-block-spacing-height-tablet':
			getSpacingPresetCssVar( heightTablet ),
		'--wp-block-spacing-height-desktop':
			getSpacingPresetCssVar( heightDesktop ),
	};

	// If selfStretch is set to 'fill' or 'fit', don't set default height.
	const finalHeights =
		selfStretch === 'fill' || selfStretch === 'fit' ? undefined : heights;
	return (
		<div
			{ ...useBlockProps.save( {
				style: {
					...finalHeights,
					width: getSpacingPresetCssVar( width ),
				},
				'aria-hidden': true,
			} ) }
		/>
	);
}
