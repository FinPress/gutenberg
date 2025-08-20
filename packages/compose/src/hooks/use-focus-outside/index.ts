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
			// Wrapping in setTimeout to run the check after focus and rendering resolves.
			setTimeout( () => {
				const containerElement = containerRef.current;
				// Use event.relatedTarget instead of activeElement since activeElement and target
				// might be body during the first blur event. Also, we're concerned with where focus
				// is moving to (inside or outside the container), not where it came from.
				const targetElement = event.relatedTarget as HTMLElement;
				// Focus is outside the container and we should run the onFocusOutside callback if:
				// - No target element
				// - No container element
				// - Target element is not contained within the container
				if (
					( ! targetElement ||
						! containerElement ||
						! containerElement.contains( targetElement ) ) &&
					'function' === typeof currentOnFocusOutsideRef.current
				) {
					currentOnFocusOutsideRef.current( event );
				}
			}, 0 );
		},
		[ containerRef ]
	);

	return { onBlur };
}
