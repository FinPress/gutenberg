/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { RichText, useBlockProps } from '@finpress/block-editor';
import { createBlock, getDefaultBlockName } from '@finpress/blocks';

export default function CodeEdit( {
	attributes,
	setAttributes,
	onRemove,
	insertBlocksAfter,
	mergeBlocks,
} ) {
	const blockProps = useBlockProps();
	return (
		<pre { ...blockProps }>
			<RichText
				tagName="code"
				identifier="content"
				value={ attributes.content }
				onChange={ ( content ) => setAttributes( { content } ) }
				onRemove={ onRemove }
				onMerge={ mergeBlocks }
				placeholder={ __( 'Write code…' ) }
				aria-label={ __( 'Code' ) }
				preserveWhiteSpace
				__unstablePastePlainText
				__unstableOnSplitAtDoubleLineEnd={ () =>
					insertBlocksAfter( createBlock( getDefaultBlockName() ) )
				}
			/>
		</pre>
	);
}
