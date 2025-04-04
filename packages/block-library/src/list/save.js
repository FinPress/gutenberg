/**
 * WordPress dependencies
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { ordered, type, reversed, start, markerColor, customMarkerColor } =
		attributes;

	const markerColorValue = markerColor || customMarkerColor;

	const TagName = ordered ? 'ol' : 'ul';
	return (
		<TagName
			{ ...useBlockProps.save( {
				reversed,
				start,
				style: {
					listStyleType:
						ordered && type !== 'decimal' ? type : undefined,
					'--wp--list-style-marker-color':
						markerColorValue || undefined,
				},
			} ) }
		>
			<InnerBlocks.Content />
		</TagName>
	);
}
