/**
 * WordPress dependencies
 */
import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { content } = attributes;

	if ( ! content || RichText.isEmpty( content ) ) {
		return null;
	}
	return (
		<li { ...useBlockProps.save() }>
			<RichText.Content value={ content } />
			<InnerBlocks.Content />
		</li>
	);
}
