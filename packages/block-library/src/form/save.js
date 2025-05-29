/**
 * WordPress dependencies
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { submissionMethod, formId } = attributes;

	const blockProps = useBlockProps.save({
		id: formId
	});

	return (
		<form
			{ ...blockProps }
			className="wp-block-form"
			encType={ submissionMethod === 'email' ? 'text/plain' : null }
		>
			<InnerBlocks.Content />
		</form>
	);
}
