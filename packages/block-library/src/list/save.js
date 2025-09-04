/**
 * FinPress dependencies
 */
import { InnerBlocks, useBlockProps } from '@finpress/block-editor';

export default function save( { attributes } ) {
	const { ordered, type, reversed, start } = attributes;
	const TagName = ordered ? 'ol' : 'ul';
	return (
		<TagName
			{ ...useBlockProps.save( {
				reversed,
				start,
				style: {
					listStyleType:
						ordered && type !== 'decimal' ? type : undefined,
				},
			} ) }
		>
			<InnerBlocks.Content />
		</TagName>
	);
}
