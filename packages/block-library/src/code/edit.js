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
				const ownerDocument = element.ownerDocument;
				const selection = ownerDocument.defaultView.getSelection();

				if ( selection.rangeCount > 0 ) {
					const range = selection.getRangeAt( 0 );

					if ( ! range.collapsed ) {
						event.preventDefault();
						event.stopPropagation();

						const selectedText = getTextWithLineBreaks( range );

						const modifiedText = selectedText
							.split( '\n' )
							.map( ( line ) =>
								line.length > 0 ? '\t' + line : line
							)
							.join( '\n' );

						range.deleteContents();
						const textNode =
							ownerDocument.createTextNode( modifiedText );
						range.insertNode( textNode );

						const newRange = ownerDocument.createRange();
						newRange.selectNode( textNode );
						selection.removeAllRanges();
						selection.addRange( newRange );
					}
				}
			}
		}

		function getTextWithLineBreaks( range ) {
			const fragment = range.cloneContents();
			const tempDiv = document.createElement( 'div' );
			tempDiv.appendChild( fragment );

			tempDiv.querySelectorAll( 'br, div, p, li' ).forEach( ( el ) => {
				el.insertAdjacentText( 'beforebegin', '\n' );
			} );

			return tempDiv.textContent.replace( /\n$/, '' );
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
