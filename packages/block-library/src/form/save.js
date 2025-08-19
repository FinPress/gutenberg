/**
 * WordPress dependencies
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const blockProps = useBlockProps.save();
	const { submissionMethod, hiddenFields } = attributes;

	const hasHiddenFields =
		hiddenFields &&
		Array.isArray( hiddenFields ) &&
		hiddenFields.length > 0;

	return (
		<form
			{ ...blockProps }
			className="wp-block-form"
			encType={ submissionMethod === 'email' ? 'text/plain' : null }
		>
			{ hasHiddenFields &&
				hiddenFields.map(
					( field ) =>
						field.name && (
							<input
								key={ field.id }
								type="hidden"
								name={ field.name }
								value={ field.value }
							/>
						)
				) }
			<InnerBlocks.Content />
		</form>
	);
}
