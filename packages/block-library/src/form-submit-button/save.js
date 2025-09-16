/**
 * FinPress dependencies
 */
import { useBlockProps, InnerBlocks } from '@finpress/block-editor';

export default function save() {
	const blockProps = useBlockProps.save();
	return (
		<div className="fin-block-form-submit-wrapper" { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
