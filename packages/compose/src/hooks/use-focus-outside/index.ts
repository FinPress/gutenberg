/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useRef } from '@wordpress/element';

type UseFocusOutsideReturn = {
	onBlur: React.FocusEventHandler;
};

/**
 * A react hook that can be used to check whether focus has moved outside the
 * element the event handlers are bound to.
 *
 * @param onFocusOutside A callback triggered when focus moves outside
 *                       the element the event handlers are bound to.
 * @param containerRef   A ref to the container element to check focus boundaries against.
 *
 * @return An object containing event handlers. Bind the event handlers to a
 * wrapping element element to capture when focus moves outside that element.
 */
export default function useFocusOutside(
	onFocusOutside: ( ( event: React.FocusEvent ) => void ) | undefined,
	containerRef: React.RefObject< HTMLElement >
): UseFocusOutsideReturn {
	const currentOnFocusOutsideRef = useRef( onFocusOutside );

	useEffect( () => {
		currentOnFocusOutsideRef.current = onFocusOutside;
	}, [ onFocusOutside ] );

	const onBlur: React.FocusEventHandler = useCallback(
		( event ) => {
			const containerElement = containerRef.current;

			if ( ! containerElement ) {
				return;
			}

			// Use event.relatedTarget instead of activeElement since activeElement
			// might be body during the blur event
			const targetElement = event.relatedTarget as HTMLElement;
			if ( ! targetElement ) {
				// If no relatedTarget, assume focus moved outside
				if ( 'function' === typeof currentOnFocusOutsideRef.current ) {
					currentOnFocusOutsideRef.current( event );
				}
				return;
			}

			// Check if the target element is contained within our container
			if ( ! containerElement.contains( targetElement ) ) {
				if ( 'function' === typeof currentOnFocusOutsideRef.current ) {
					currentOnFocusOutsideRef.current( event );
				}
			}
		},
		[ containerRef ]
	);

	return { onBlur };
}
