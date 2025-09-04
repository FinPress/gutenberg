/**
 * FinPress dependencies
 */
import { RichText, useBlockProps, InnerBlocks } from '@finpress/block-editor';

export default function save( { attributes } ) {
	const { name, showContent } = attributes;
	const summary = attributes.summary ? attributes.summary : 'Details';
	const blockProps = useBlockProps.save();

	return (
		<details
			{ ...blockProps }
			name={ name || undefined }
			open={ showContent }
		>
			<summary>
				<RichText.Content value={ summary } />
			</summary>
			<InnerBlocks.Content />
		</details>
	);
}
