/**
 * WordPress dependencies
 */
import { useRef, useEffect } from '@wordpress/element';
import { focus } from '@wordpress/dom';

/**
 * Internal dependencies
 */
import useRefEffect from '../use-ref-effect';

/**
 * External dependencies
 */
import type { RefCallback, MutableRefObject } from 'react';

/**
 * Hook used to focus the first tabbable element on mount.
 *
 * @param focusOnMount Focus on mount mode.
 * @return Ref callback.
 *
 * @example
 * ```js
 * import { useFocusOnMount } from '@wordpress/compose';
 *
 * const WithFocusOnMount = () => {
 *     const ref = useFocusOnMount()
 *     return (
 *         <div ref={ ref }>
 *             <Button />
 *             <Button />
 *         </div>
 *     );
 * }
 * ```
 */
export default function useFocusOnMount(
	focusOnMount: boolean | 'firstElement' = 'firstElement'
): RefCallback< HTMLElement > {
	const focusOnMountRef = useRef( focusOnMount );

	/**
	 * Sets focus on a DOM element.
	 *
	 * @param target The DOM element to set focus to.
	 */
	const setFocus = ( target: HTMLElement ) => {
		target.focus( {
			// When focusing newly mounted dialogs,
			// the position of the popover is often not right on the first render
			// This prevents the layout shifts when focusing the dialogs.
			preventScroll: true,
		} );
	};

	const timerIdRef: MutableRefObject<
		ReturnType< typeof setTimeout > | undefined
	> = useRef();

	useEffect( () => {
		focusOnMountRef.current = focusOnMount;
	}, [ focusOnMount ] );

	return useRefEffect( ( node ) => {
		if ( ! node || focusOnMountRef.current === false ) {
			return;
		}

		if ( node.contains( node.ownerDocument?.activeElement ?? null ) ) {
			return;
		}

		if ( focusOnMountRef.current !== 'firstElement' ) {
			setFocus( node );
			return;
		}

		timerIdRef.current = setTimeout( () => {
			const firstTabbable = focus.tabbable.find( node )[ 0 ];
			if ( firstTabbable ) {
				setFocus( firstTabbable );
			}
		}, 0 );

		return () => {
			if ( timerIdRef.current ) {
				clearTimeout( timerIdRef.current );
			}
		};
	}, [] );
}
