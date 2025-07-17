/**
 * WordPress dependencies
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const blockProps = useBlockProps.save();
	const { submissionMethod, redirectUrl } = attributes;

	return (
		<form
			{ ...blockProps }
			className="wp-block-form"
			encType={ submissionMethod === 'email' ? 'text/plain' : null }
			data-redirect-url={ redirectUrl }
		>
			<InnerBlocks.Content />
		</form>
	);
}
