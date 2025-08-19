/**
 * WordPress dependencies
 */
import { useCallback, useState, useRef } from '@wordpress/element';
import {
	createHigherOrderComponent,
	__experimentalUseFocusOutside as useFocusOutside,
} from '@wordpress/compose';

export default createHigherOrderComponent(
	( WrappedComponent ) => ( props ) => {
		const [ handleFocusOutside, setHandleFocusOutside ] = useState<
			undefined | ( ( event: React.FocusEvent ) => void )
		>( undefined );

		const bindFocusOutsideHandler = useCallback<
			( node: React.FocusEvent ) => void
		>(
			( node: any ) =>
				setHandleFocusOutside( () =>
					node?.handleFocusOutside
						? node.handleFocusOutside.bind( node )
						: undefined
				),
			[]
		);

		const containerRef = useRef< HTMLDivElement >( null );

		return (
			<div
				ref={ containerRef }
				{ ...useFocusOutside( handleFocusOutside, containerRef ) }
			>
				<WrappedComponent
					ref={ bindFocusOutsideHandler }
					{ ...props }
				/>
			</div>
		);
	},
	'withFocusOutside'
);
