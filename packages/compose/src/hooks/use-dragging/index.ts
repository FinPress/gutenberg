/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import useIsomorphicLayoutEffect from '../use-isomorphic-layout-effect';

/**
 * External dependencies
 */
import type { MouseEvent as ReactMouseEvent } from 'react';

interface UseDraggingProps {
	onDragStart?: ( e: ReactMouseEvent ) => void;
	onDragMove?: ( e: MouseEvent ) => void;
	onDragEnd?: ( e?: MouseEvent ) => void;
}

// Event handlers that are triggered from `document` listeners accept a MouseEvent,
// while those triggered from React listeners accept a React.MouseEvent.
/**
 * @param props
 * @param props.onDragStart
 * @param props.onDragMove
 * @param props.onDragEnd
 */
export default function useDragging( {
	onDragStart,
	onDragMove,
	onDragEnd,
}: UseDraggingProps ) {
	const [ isDragging, setIsDragging ] = useState( false );

	const eventsRef = useRef( {
		onDragStart,
		onDragMove,
		onDragEnd,
	} );
	useIsomorphicLayoutEffect( () => {
		eventsRef.current.onDragStart = onDragStart;
		eventsRef.current.onDragMove = onDragMove;
		eventsRef.current.onDragEnd = onDragEnd;
	}, [ onDragStart, onDragMove, onDragEnd ] );

	const onMouseMove = useCallback(
		( event: MouseEvent ) =>
			eventsRef.current.onDragMove &&
			eventsRef.current.onDragMove( event ),
		[]
	);
	const endDrag = useCallback( ( event: MouseEvent ) => {
		if ( eventsRef.current.onDragEnd ) {
			eventsRef.current.onDragEnd( event );
		}
		document.removeEventListener( 'mousemove', onMouseMove );
		document.removeEventListener( 'mouseup', endDrag );
		setIsDragging( false );
	}, [] );
	const startDrag = useCallback( ( event: ReactMouseEvent ) => {
		if ( eventsRef.current.onDragStart ) {
			eventsRef.current.onDragStart( event );
		}
		document.addEventListener( 'mousemove', onMouseMove );
		document.addEventListener( 'mouseup', endDrag );
		setIsDragging( true );
	}, [] );

	// Remove the global events when unmounting if needed.
	useEffect( () => {
		return () => {
			if ( isDragging ) {
				document.removeEventListener( 'mousemove', onMouseMove );
				document.removeEventListener( 'mouseup', endDrag );
			}
		};
	}, [ isDragging ] );

	return {
		startDrag,
		endDrag,
		isDragging,
	};
}
