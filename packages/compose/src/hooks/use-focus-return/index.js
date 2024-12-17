/**
 * WordPress dependencies
 */
import { useRef, useEffect, useCallback } from '@wordpress/element';

/** @type {Element|null} */
let origin = null;

/**
 * Adds the unmount behavior of returning focus to the element which had it
 * previously as is expected for roles like menus or dialogs.
 *
 * @param {() => void} [onFocusReturn] Overrides the default return behavior.
 * @return {import('react').RefCallback<HTMLElement>} Element Ref.
 *
 * @example
 * ```js
 * import { useFocusReturn } from '@wordpress/compose';
 *
 * const WithFocusReturn = () => {
 *     const ref = useFocusReturn()
 *     return (
 *         <div ref={ ref }>
 *             <Button />
 *             <Button />
 *         </div>
 *     );
 * }
 * ```
 */
function useFocusReturn( onFocusReturn ) {
	/** @type {import('react').MutableRefObject<null | HTMLElement>} */
	const ref = useRef( null );
	/** @type {import('react').MutableRefObject<null | Element>} */
	const focusedBeforeMount = useRef( null );
	const onFocusReturnRef = useRef( onFocusReturn );
	useEffect( () => {
		onFocusReturnRef.current = onFocusReturn;
	}, [ onFocusReturn ] );

	return useCallback( ( node ) => {
		if ( node ) {
			// Set ref to be used when unmounting.
			ref.current = node;

			// Only set when the node mounts.
			if ( focusedBeforeMount.current ) {
				return;
			}

			/** @type {any} */
			const activeElement = node.ownerDocument.activeElement;

			// If the activeElement is an iframe, we need to get the active element within the iframe.
			// Otherwise, focus from items within the iframed canvas will get sent to the iframe itself,
			// not the active element within the iframe.
			if (
				activeElement?.tagName === 'IFRAME' &&
				activeElement.contentDocument?.activeElement
			) {
				focusedBeforeMount.current =
					activeElement.contentDocument.activeElement;
			} else {
				focusedBeforeMount.current = activeElement;
			}
		} else if ( focusedBeforeMount.current ) {
			const isFocused = ref.current?.contains(
				ref.current?.ownerDocument.activeElement
			);

			if ( ref.current?.isConnected && ! isFocused ) {
				origin ??= focusedBeforeMount.current;
				return;
			}

			// Defer to the component's own explicit focus return behavior, if
			// specified. This allows for support that the `onFocusReturn`
			// decides to allow the default behavior to occur under some
			// conditions.
			if ( onFocusReturnRef.current ) {
				onFocusReturnRef.current();
			} else {
				/** @type {null|HTMLElement} */ (
					! focusedBeforeMount.current.isConnected
						? origin
						: focusedBeforeMount.current
				)?.focus();
			}
			origin = null;
		}
	}, [] );
}

export default useFocusReturn;
