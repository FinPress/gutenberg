/**
 * WordPress dependencies
 */
import { useState, useLayoutEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ContrastChecker from '../components/contrast-checker';
import { useBlockElement } from '../components/block-list/use-block-props/use-block-refs';

function getComputedValue( node, property ) {
	return node.ownerDocument.defaultView
		.getComputedStyle( node )
		.getPropertyValue( property );
}

function getBlockElementColors( blockEl ) {
	if ( ! blockEl ) {
		return {};
	}

	const firstLinkElement = blockEl.querySelector( 'a' );
	const linkColor = !! firstLinkElement?.innerText
		? getComputedValue( firstLinkElement, 'color' )
		: null;

	const textColor = getComputedValue( blockEl, 'color' );

	let backgroundColorNode = blockEl;
	let backgroundColor = getComputedValue(
		backgroundColorNode,
		'background-color'
	);
	while (
		backgroundColor === 'rgba(0, 0, 0, 0)' &&
		backgroundColorNode.parentNode &&
		backgroundColorNode.parentNode.nodeType ===
			backgroundColorNode.parentNode.ELEMENT_NODE
	) {
		backgroundColorNode = backgroundColorNode.parentNode;
		backgroundColor = getComputedValue(
			backgroundColorNode,
			'background-color'
		);
	}

	return {
		textColor,
		backgroundColor,
		linkColor,
	};
}

export default function BlockColorContrastChecker( { clientId } ) {
	const [ detectedBackgroundColor, setDetectedBackgroundColor ] = useState();
	const [ detectedColor, setDetectedColor ] = useState();
	const [ detectedLinkColor, setDetectedLinkColor ] = useState();
	const blockEl = useBlockElement( clientId );

	// There are so many things that can change the color of a block
	// So we perform this check on every render.
	useLayoutEffect( () => {
		if ( ! blockEl ) {
			return;
		}

		function updateColors() {
			const colors = getBlockElementColors( blockEl );
			setDetectedColor( colors.textColor );
			setDetectedBackgroundColor( colors.backgroundColor );
			if ( colors.linkColor ) {
				setDetectedLinkColor( colors.linkColor );
			}
		}

		window.requestAnimationFrame( () =>
			window.requestAnimationFrame( updateColors )
		);
	} );

	return (
		<ContrastChecker
			backgroundColor={ detectedBackgroundColor }
			textColor={ detectedColor }
			linkColor={ detectedLinkColor }
			enableAlphaChecker
		/>
	);
}
