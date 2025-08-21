/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useRef } from '@wordpress/element';

type UseFocusOutsideReturn = {
	onFocus: React.FocusEventHandler;
	onBlur: React.FocusEventHandler;
};

/**
 * A react hook that can be used to check whether focus has moved outside the
 * element the event handlers are bound to.
 *
 * @param onFocusOutside A callback triggered when focus moves outside
 *                       the element the event handlers are bound to.
 *
 * @return An object containing event handlers. Bind the event handlers to a
 * wrapping element element to capture when focus moves outside that element.
 */
export default function useFocusOutside(
	onFocusOutside: ( ( event: React.FocusEvent ) => void ) | undefined
): UseFocusOutsideReturn {
	const currentOnFocusOutsideRef = useRef( onFocusOutside );
	useEffect( () => {
		currentOnFocusOutsideRef.current = onFocusOutside;
	}, [ onFocusOutside ] );

	const blurCheckTimeoutIdRef = useRef< number | undefined >();

	/**
	 * Cancel a blur check timeout.
	 */
	const cancelBlurCheck = useCallback( () => {
		clearTimeout( blurCheckTimeoutIdRef.current );
	}, [] );

	/**
	 * A callback triggered when a blur event occurs on the element the handler
	 * is bound to.
	 *
	 * Calls the `onFocusOutside` callback in an immediate timeout if focus has
	 * move outside the bound element and is still within the document.
	 */
	const queueBlurCheck: React.FocusEventHandler = useCallback( ( event ) => {
		// React does not allow using an event reference asynchronously
		// due to recycling behavior, except when explicitly persisted.
		event.persist();

		blurCheckTimeoutIdRef.current = setTimeout( () => {
			// If document is not focused then focus should remain
			// inside the wrapped component and therefore we cancel
			// this blur event thereby leaving focus in place.
			// https://developer.mozilla.org/en-US/docs/Web/API/Document/hasFocus.
			if ( ! document.hasFocus() ) {
				event.preventDefault();
				return;
			}

			if ( 'function' === typeof currentOnFocusOutsideRef.current ) {
				currentOnFocusOutsideRef.current( event );
			}
		}, 0 );
	}, [] );

	return {
		onFocus: cancelBlurCheck,
		onBlur: queueBlurCheck,
	};
}
