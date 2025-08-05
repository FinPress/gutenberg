/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { createBlock, getDefaultBlockName } from '@wordpress/blocks';
import { useRefEffect } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

export default function CodeEdit( {
	attributes,
	setAttributes,
	onRemove,
	insertBlocksAfter,
	mergeBlocks,
} ) {
	const blockProps = useBlockProps();

	const ref = useRefEffect( ( element ) => {
		function handleKeyDown( event ) {
			if ( event.key === 'Tab' ) {
				event.preventDefault();
				event.stopPropagation();

				const ownerDocument = element.ownerDocument;
				const selection = ownerDocument.defaultView.getSelection();
				if ( selection.rangeCount > 0 ) {
					const range = selection.getRangeAt( 0 );
					range.deleteContents();
					const tabNode = ownerDocument.createTextNode( '\t' );
					range.insertNode( tabNode );
					range.setStartAfter( tabNode );
					range.setEndAfter( tabNode );
					selection.removeAllRanges();
					selection.addRange( range );
				}
			}
		}

		element.addEventListener( 'keydown', handleKeyDown, true );
		return () => {
			element.removeEventListener( 'keydown', handleKeyDown, true );
		};
	}, [] );

	return (
		<pre { ...blockProps }>
			<RichText
				ref={ ref }
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
