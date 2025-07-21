/**
 * WordPress dependencies
 */
import { unwrap } from '@wordpress/dom';

/**
 * Flattens nested tags to prevent invalid HTML and improve rendering.
 * Specifically handles:
 * 1. Nested <strong> tags - combines them into a single <strong> tag
 * 2. Nested <a> tags - removes inner anchor tags (invalid HTML)
 *
 * @param {Node} node The node to be processed.
 * @return {void}
 */
export default function nestedTagsFlattener( node ) {
	if ( node.nodeType !== node.ELEMENT_NODE ) {
		return;
	}

	const tagName = node.tagName.toLowerCase();

	// Handle nested <strong> tags
	if ( tagName === 'strong' ) {
		// Find any nested <strong> elements within this node
		const nestedStrongTags = node.querySelectorAll( 'strong' );

		if ( nestedStrongTags.length > 0 ) {
			// Unwrap all nested <strong> tags, keeping their content
			nestedStrongTags.forEach( ( nestedTag ) => {
				unwrap( nestedTag );
			} );
		}
		return;
	}

	// Handle nested <a> tags (invalid HTML)
	if ( tagName === 'a' ) {
		// Collect all text content from nested anchor tags
		const nestedAnchorTags = Array.from( node.querySelectorAll( 'a' ) );

		if ( nestedAnchorTags.length > 0 ) {
			// For each nested anchor, replace it with just its text content
			nestedAnchorTags.forEach( ( nestedTag ) => {
				const textNode = node.ownerDocument.createTextNode(
					nestedTag.textContent
				);
				nestedTag.parentNode.insertBefore( textNode, nestedTag );
				nestedTag.parentNode.removeChild( nestedTag );
			} );
		}
		return;
	}

	// Handle other potential nesting issues for similar inline formatting tags
	const inlineFormattingTags = [
		'em',
		'i',
		'b',
		'u',
		's',
		'del',
		'ins',
		'mark',
		'small',
		'sub',
		'sup',
	];

	if ( inlineFormattingTags.includes( tagName ) ) {
		// Find any nested elements with the same tag name
		const nestedSameTags = node.querySelectorAll( tagName );

		if ( nestedSameTags.length > 0 ) {
			// Unwrap nested tags of the same type
			nestedSameTags.forEach( ( nestedTag ) => {
				unwrap( nestedTag );
			} );
		}
	}
}
