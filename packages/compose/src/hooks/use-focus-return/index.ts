/**
 * WordPress dependencies
 */
import { useRef, useEffect, useCallback } from '@wordpress/element';

/**
 * External dependencies
 */
import type { RefCallback, MutableRefObject } from 'react';

let origin: Element | null = null;

/**
 * Adds the unmount behavior of returning focus to the element which had it
 * previously as is expected for roles like menus or dialogs.
 *
 * @param onFocusReturn Overrides the default return behavior.
 * @return Element Ref.
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
function useFocusReturn(
	onFocusReturn?: () => void
): RefCallback< HTMLElement > {
	const ref: MutableRefObject< null | HTMLElement > = useRef( null );
	const focusedBeforeMount: MutableRefObject< null | Element > =
		useRef( null );
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

			const activeDocument =
				node.ownerDocument.activeElement instanceof
				window.HTMLIFrameElement
					? node.ownerDocument.activeElement.contentDocument
					: node.ownerDocument;

			focusedBeforeMount.current = activeDocument?.activeElement ?? null;
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
				(
					( ! focusedBeforeMount.current.isConnected
						? origin
						: focusedBeforeMount.current ) as HTMLElement | null
				 )?.focus();
			}
			origin = null;
		}
	}, [] );
}

export default useFocusReturn;
