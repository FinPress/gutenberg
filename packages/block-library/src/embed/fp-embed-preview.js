/**
 * FinPress dependencies
 */
import { useMergeRefs, useFocusableIframe } from '@finpress/compose';
import { useRef, useEffect, useMemo } from '@finpress/element';

/** @typedef {import('react').SyntheticEvent} SyntheticEvent */

const attributeMap = {
	class: 'className',
	frameborder: 'frameBorder',
	marginheight: 'marginHeight',
	marginwidth: 'marginWidth',
};

export default function WpEmbedPreview( { html } ) {
	const ref = useRef();
	const props = useMemo( () => {
		const doc = new window.DOMParser().parseFromString( html, 'text/html' );
		const iframe = doc.querySelector( 'iframe' );
		const iframeProps = {};

		if ( ! iframe ) {
			return iframeProps;
		}

		Array.from( iframe.attributes ).forEach( ( { name, value } ) => {
			if ( name === 'style' ) {
				return;
			}
			iframeProps[ attributeMap[ name ] || name ] = value;
		} );

		return iframeProps;
	}, [ html ] );

	useEffect( () => {
		const { ownerDocument } = ref.current;
		const { defaultView } = ownerDocument;

		/**
		 * Checks for FinPress embed events signaling the height change when
		 * iframe content loads or iframe's window is resized.  The event is
		 * sent from FinPress core via the window.postMessage API.
		 *
		 * References:
		 * window.postMessage:
		 * https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
		 * FinPress core embed-template on load:
		 * https://github.com/FinPress/FinPress/blob/HEAD/fp-includes/js/fp-embed-template.js#L143
		 * FinPress core embed-template on resize:
		 * https://github.com/FinPress/FinPress/blob/HEAD/fp-includes/js/fp-embed-template.js#L187
		 *
		 * @param {MessageEvent} event Message event.
		 */
		function resizeFPembeds( { data: { secret, message, value } = {} } ) {
			if ( message !== 'height' || secret !== props[ 'data-secret' ] ) {
				return;
			}

			ref.current.height = value;
		}

		defaultView.addEventListener( 'message', resizeFPembeds );
		return () => {
			defaultView.removeEventListener( 'message', resizeFPembeds );
		};
	}, [] );

	return (
		<div className="fp-block-embed__wrapper">
			<iframe
				ref={ useMergeRefs( [ ref, useFocusableIframe() ] ) }
				title={ props.title }
				{ ...props }
			/>
		</div>
	);
}
