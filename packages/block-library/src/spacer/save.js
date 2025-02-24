/**
 * WordPress dependencies
 */
import { useBlockProps, getSpacingPresetCssVar } from '@wordpress/block-editor';

const DEFAULT_HEIGHT = '100px';

export default function save( { attributes } ) {
	const { height, width, style } = attributes;
	const { layout: { selfStretch } = {} } = style || {};
	// If selfStretch is set to 'fill' or 'fit', don't set default height.
	const finalHeight =
		selfStretch === 'fill' || selfStretch === 'fit' ? undefined : height;
	return (
		<div
			{ ...useBlockProps.save( {
				style: {
					height:
						getSpacingPresetCssVar( finalHeight ) || DEFAULT_HEIGHT,
					width: getSpacingPresetCssVar( width ),
				},
				'aria-hidden': true,
			} ) }
		/>
	);
}
