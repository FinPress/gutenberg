/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { escape } from './utils';

export default function save( { attributes } ) {
	const { content, showLineNumbers } = attributes;

	// eslint-disable-next-line no-shadow
	const calculateLineNumbers = ( content ) => {
		return content.split( '\n' ).map( ( _, index ) => index + 1 );
	};

	const contentString =
		typeof content === 'string'
			? content
			: content.toHTMLString( {
					preserveWhiteSpace: true,
			  } );

	const lineNumbers = calculateLineNumbers( contentString );

	return (
		<div
			{ ...useBlockProps.save() }
			className="wp-block-code-with-line-numbers"
		>
			{ /* Conditionally render line numbers */ }
			{ showLineNumbers && (
				<div className="line-numbers">
					{ lineNumbers.map( ( num ) => (
						<div key={ num }>{ num }</div>
					) ) }
				</div>
			) }

			{ /* Render code content */ }
			<pre className="code-content">
				<RichText.Content
					tagName="code"
					value={ escape( contentString ) }
				/>
			</pre>
		</div>
	);
}
