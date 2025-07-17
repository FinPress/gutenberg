/* global DOMParser, NodeFilter */

const parser = new DOMParser();

/**
 * Custom filter function to process Google Docs HTML, converting Markdown patterns
 * into semantic HTML (`<code>`, `<pre>`) while preserving other formatting.
 *
 * @param {string} htmlString The HTML content from the clipboard (from GDocs).
 * @return {string} The processed HTML string with Markdown converted.
 */
export default function googleDocsHtmlMarkdownProcessor( htmlString ) {
	// Detect if it's a Google Docs paste from the HTML string.
	const isGoogleDocsHtml = htmlString.includes( 'docs-internal-guid-' );
	if ( ! isGoogleDocsHtml ) {
		return htmlString;
	}

	const doc = parser.parseFromString( htmlString, 'text/html' );
	const body = doc.body;

	const allTextNodes = [];
	const treeWalker = doc.createTreeWalker(
		body,
		NodeFilter.SHOW_TEXT,
		null,
		false
	);
	let currentNode;
	while ( ( currentNode = treeWalker.nextNode() ) ) {
		allTextNodes.push( currentNode );
	}

	allTextNodes.forEach( ( node ) => {
		const textContent = node.nodeValue;
		const inlineCodeRegex = /`([^`]+)`/g;

		if ( ! inlineCodeRegex.test( textContent ) ) {
			return; // No inline code found in this node.
		}

		inlineCodeRegex.lastIndex = 0;

		const fragment = doc.createDocumentFragment();
		let lastIndex = 0;
		let match;
		let changed = false;

		while ( ( match = inlineCodeRegex.exec( textContent ) ) !== null ) {
			const codeContent = match[ 1 ];
			const startIndex = match.index;
			const endIndex = inlineCodeRegex.lastIndex;

			if ( startIndex > lastIndex ) {
				fragment.appendChild(
					doc.createTextNode(
						textContent.substring( lastIndex, startIndex )
					)
				);
			}

			const codeElement = doc.createElement( 'code' );
			codeElement.textContent = codeContent;
			fragment.appendChild( codeElement );
			changed = true;

			lastIndex = endIndex;
		}

		if ( lastIndex < textContent.length ) {
			fragment.appendChild(
				doc.createTextNode( textContent.substring( lastIndex ) )
			);
		}

		if ( changed ) {
			const parent = node.parentNode;
			if ( parent ) {
				parent.replaceChild( fragment, node );
			}
		}
	} );

	return body.innerHTML;
}
