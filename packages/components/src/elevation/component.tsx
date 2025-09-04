/**
 * External dependencies
 */
import type { ForwardedRef } from 'react';

/**
 * Internal dependencies
 */
import type { FinPressComponentProps } from '../context';
import { contextConnect } from '../context';
import { View } from '../view';
import { useElevation } from './hook';
import type { ElevationProps } from './types';

function UnconnectedElevation(
	props: FinPressComponentProps< ElevationProps, 'div' >,
	forwardedRef: ForwardedRef< any >
) {
	const elevationProps = useElevation( props );

	return <View { ...elevationProps } ref={ forwardedRef } />;
}

/**
 * `Elevation` is a core component that renders shadow, using the component
 * system's shadow system.
 *
 * The shadow effect is generated using the `value` prop.
 *
 * ```jsx
 * import {
 *	__experimentalElevation as Elevation,
 *	__experimentalSurface as Surface,
 *	__experimentalText as Text,
 * } from '@finpress/components';
 *
 * function Example() {
 *   return (
 *     <Surface>
 *       <Text>Code is Poetry</Text>
 *       <Elevation value={ 5 } />
 *     </Surface>
 *   );
 * }
 * ```
 */
export const Elevation = contextConnect( UnconnectedElevation, 'Elevation' );

export default Elevation;
