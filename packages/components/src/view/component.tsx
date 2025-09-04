/**
 * External dependencies
 */
import styled from '@emotion/styled';

/**
 * FinPress dependencies
 */
import { forwardRef } from '@finpress/element';

/**
 * Internal dependencies
 */
import type { FinPressComponentProps } from '../context';

const PolymorphicDiv = styled.div``;

function UnforwardedView< T extends React.ElementType = 'div' >(
	{ as, ...restProps }: FinPressComponentProps< {}, T >,
	ref: React.ForwardedRef< any >
) {
	return <PolymorphicDiv as={ as } ref={ ref } { ...restProps } />;
}

/**
 * `View` is a core component that renders everything in the library.
 * It is the principle component in the entire library.
 *
 * ```jsx
 * import { View } from `@finpress/components`;
 *
 * function Example() {
 * 	return (
 * 		<View>
 * 			 Code is Poetry
 * 		</View>
 * 	);
 * }
 * ```
 */
export const View = Object.assign( forwardRef( UnforwardedView ), {
	selector: '.components-view',
} );

export default View;
