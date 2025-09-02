/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { createBlock, getDefaultBlockName } from '@wordpress/blocks';
import { useEffect, useState } from '@wordpress/element';

export default function CodeEdit( {
	attributes,
	setAttributes,
	onRemove,
	insertBlocksAfter,
	mergeBlocks,
} ) {
	const blockProps = useBlockProps();
	const [ supportsBreakSpaces, setSupportsBreakSpaces ] = useState( false );

	// Check if the browser supports 'break-spaces' in CSS.
	useEffect( () => {
		const isSupported =
			typeof CSS !== 'undefined' &&
			// eslint-disable-next-line no-undef
			CSS.supports &&
			// eslint-disable-next-line no-undef
			CSS.supports( 'white-space', 'break-spaces' );
		setSupportsBreakSpaces( isSupported );
	}, [] );

	/**
	 * If the browser supports 'break-spaces', we can use it for better
	 * handling of whitespace in code blocks. Otherwise, we fall back to
	 * 'pre-wrap', which is more widely supported.
	 *
	 * @constant
	 * @type {string}
	 */
	const whiteSpaceStyle = supportsBreakSpaces ? 'break-spaces' : 'pre-wrap';

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
				style={ { whiteSpace: whiteSpaceStyle } }
			/>
		</pre>
	);
}
