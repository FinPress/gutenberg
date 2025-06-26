/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { escape } from './utils';

export default function save( { attributes } ) {
	// To do: `escape` encodes characters in shortcodes and URLs to
	// prevent embedding in PHP. Ideally checks for the code block,
	// or pre/code tags, should be made on the PHP side?
	const content = escape(
		typeof attributes.content === 'string'
			? attributes.content
			: attributes.content.toHTMLString( {
					preserveWhiteSpace: true,
			  } )
	);

	if ( RichText.isEmpty( content ) ) {
		return null;
	}

	return (
		<pre { ...useBlockProps.save() }>
			<RichText.Content tagName="code" value={ content } />
		</pre>
	);
}
