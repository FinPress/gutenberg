/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { createBlock, getDefaultBlockName } from '@wordpress/blocks';
import { useState, useEffect } from '@wordpress/element';

export default function CodeEdit( {
	attributes,
	setAttributes,
	onRemove,
	insertBlocksAfter,
	mergeBlocks,
} ) {
	const blockProps = useBlockProps();
	const [ lineNumbers, setLineNumbers ] = useState( [] );

	// Function to calculate line numbers dynamically
	const calculateLineNumbers = ( content ) => {
		return content.split( '\n' ).map( ( _, index ) => index + 1 );
	};

	// Update line numbers whenever the content changes
	useEffect( () => {
		const content =
			typeof attributes.content === 'string'
				? attributes.content
				: attributes.content.toHTMLString( {
						preserveWhiteSpace: true,
				  } );
		setLineNumbers( calculateLineNumbers( content ) );
	}, [ attributes.content ] );

	return (
		<div { ...blockProps } className="wp-block-code-with-line-numbers">
			<div className="line-numbers">
				{ lineNumbers.map( ( num ) => (
					<div key={ num }>{ num }</div>
				) ) }
			</div>
			<pre className="code-content">
				<RichText
					tagName="code"
					identifier="content"
					value={ attributes.content }
					onChange={ ( content ) => setAttributes( { content } ) }
					onRemove={ onRemove }
					onMerge={ mergeBlocks }
					placeholder="Write code…"
					aria-label="Code"
					preserveWhiteSpace
					__unstablePastePlainText
					__unstableOnSplitAtDoubleLineEnd={ () =>
						insertBlocksAfter(
							createBlock( getDefaultBlockName() )
						)
					}
				/>
			</pre>
		</div>
	);
}
