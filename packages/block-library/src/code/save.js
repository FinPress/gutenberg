/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { escape } from './utils';

export default function save( { attributes } ) {
	// Calculate the number of lines dynamically
	const calculateLineNumbers = ( content ) => {
		return content.split( '\n' ).map( ( _, index ) => index + 1 );
	};

	const content =
		typeof attributes.content === 'string'
			? attributes.content
			: attributes.content.toHTMLString( {
					preserveWhiteSpace: true,
			  } );

	const lineNumbers = calculateLineNumbers( content );

	return (
		<div
			{ ...useBlockProps.save() }
			className="wp-block-code-with-line-numbers"
		>
			<div className="line-numbers">
				{ lineNumbers.map( ( num ) => (
					<div key={ num }>{ num }</div>
				) ) }
			</div>
			<pre className="code-content">
				<RichText.Content
					tagName="code"
					// To do: `escape` encodes characters in shortcodes and URLs to
					// prevent embedding in PHP. Ideally checks for the code block,
					// or pre/code tags, should be made on the PHP side?
					value={ escape( content ) }
				/>
			</pre>
		</div>
	);
}
