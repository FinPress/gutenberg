/**
 * Build the live regions markup.
 *
 * @param {string} [ariaLive] Value for the 'aria-live' attribute; default: 'polite'.
 *
 * @return {HTMLDivElement} The ARIA live region HTML element.
 */
export default function addContainer( ariaLive = 'polite' ) {
	const container = document.createElement( 'div' );
	container.id = `a11y-speak-${ ariaLive }`;
	container.className = 'a11y-speak-region';

	Object.assign( container.style, {
		position: 'absolute',
		margin: '-1px',
		padding: '0',
		height: '1px',
		width: '1px',
		overflow: 'hidden',
		clip: 'rect(1px, 1px, 1px, 1px)',
		webkitClipPath: 'inset(50%)',
		clipPath: 'inset(50%)',
		border: '0',
		wordWrap: 'normal',
	} );
	container.setAttribute( 'aria-live', ariaLive );
	container.setAttribute( 'aria-relevant', 'additions text' );
	container.setAttribute( 'aria-atomic', 'true' );

	const { body } = document;
	if ( body ) {
		body.appendChild( container );
	}

	return container;
}
