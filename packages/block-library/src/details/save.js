/**
 * WordPress dependencies
 */
import { RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { showContent } = attributes;
	const blockProps = useBlockProps.save();

	return (
		<details { ...blockProps } open={ showContent }>
			<summary>
				<RichText.Content value={ attributes.summary } />
			</summary>
			<InnerBlocks.Content />
		</details>
	);
}
