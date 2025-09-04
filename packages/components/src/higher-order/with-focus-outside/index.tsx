/**
 * FinPress dependencies
 */
import { useCallback, useState } from '@finpress/element';
import {
	createHigherOrderComponent,
	__experimentalUseFocusOutside as useFocusOutside,
} from '@finpress/compose';

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

		return (
			<div { ...useFocusOutside( handleFocusOutside ) }>
				<WrappedComponent
					ref={ bindFocusOutsideHandler }
					{ ...props }
				/>
			</div>
		);
	},
	'withFocusOutside'
);
