/**
 * External dependencies
 */
import Clipboard from 'clipboard';
import type { RefObject, Ref } from 'react';

/**
 * WordPress dependencies
 */
import { useRef, useLayoutEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import useRefEffect from '../use-ref-effect';

/**
 * @template T
 * @param    value
 * @return  The updated ref
 */
function useUpdatedRef< T >( value: T ): RefObject< T > {
	const ref = useRef( value );
	useLayoutEffect( () => {
		ref.current = value;
	}, [ value ] );
	return ref;
}

/**
 * Copies the given text to the clipboard when the element is clicked.
 *
 * @template  TElementType
 * @param    text      The text to copy. Use a function if not
 *                     already available and expensive to compute.
 * @param    onSuccess Called when to text is copied.
 *
 * @return  A ref to assign to the target element.
 */
export default function useCopyToClipboard< TElementType extends HTMLElement >(
	text: string | ( () => string ),
	onSuccess: Function
): Ref< TElementType > {
	// Store the dependencies as refs and continuously update them so they're
	// fresh when the callback is called.
	const textRef = useUpdatedRef( text );
	const onSuccessRef = useUpdatedRef( onSuccess );
	return useRefEffect( ( node ) => {
		// Clipboard listens to click events.
		const clipboard = new Clipboard( node, {
			text() {
				return typeof textRef.current === 'function'
					? textRef.current()
					: textRef.current || '';
			},
		} );

		clipboard.on( 'success', ( { clearSelection } ) => {
			// Clearing selection will move focus back to the triggering
			// button, ensuring that it is not reset to the body, and
			// further that it is kept within the rendered node.
			clearSelection();

			if ( onSuccessRef.current ) {
				onSuccessRef.current();
			}
		} );

		return () => {
			clipboard.destroy();
		};
	}, [] );
}
