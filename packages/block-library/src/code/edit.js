/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	RichText,
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { createBlock, getDefaultBlockName } from '@wordpress/blocks';
import { useState, useEffect } from '@wordpress/element';
import { PanelBody, ToggleControl } from '@wordpress/components';

export default function CodeEdit( {
	attributes,
	setAttributes,
	onRemove,
	insertBlocksAfter,
	mergeBlocks,
} ) {
	const blockProps = useBlockProps();
	const [ lineNumbers, setLineNumbers ] = useState( [] );
	const { content, showLineNumbers } = attributes;

	// eslint-disable-next-line no-shadow
	const calculateLineNumbers = ( content ) => {
		return content.split( '\n' ).map( ( _, index ) => index + 1 );
	};

	// Update line numbers whenever the content changes
	useEffect( () => {
		const contentString =
			typeof content === 'string'
				? content
				: content.toHTMLString( {
						preserveWhiteSpace: true,
				  } );
		setLineNumbers( calculateLineNumbers( contentString ) );
	}, [ content ] );

	return (
		<>
			{ /* Inspector Controls */ }
			<InspectorControls>
				<PanelBody title={ __( 'Code Block Settings' ) }>
					<ToggleControl
						label={ __( 'Show Line Numbers' ) }
						__nextHasNoMarginBottom
						checked={ showLineNumbers }
						onChange={ ( value ) =>
							setAttributes( { showLineNumbers: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			{ /* Block Content */ }
			<div { ...blockProps } className="wp-block-code-with-line-numbers">
				{ /* Line Numbers */ }
				{ showLineNumbers && (
					<div className="line-numbers">
						{ lineNumbers.map( ( num ) => (
							<div key={ num }>{ num }</div>
						) ) }
					</div>
				) }

				{ /* Code Content */ }
				<pre className="code-content">
					<RichText
						tagName="code"
						identifier="content"
						value={ content }
						// eslint-disable-next-line no-shadow
						onChange={ ( content ) => setAttributes( { content } ) }
						onRemove={ onRemove }
						onMerge={ mergeBlocks }
						placeholder={ __( 'Write code…' ) }
						aria-label={ __( 'Code' ) }
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
		</>
	);
}
