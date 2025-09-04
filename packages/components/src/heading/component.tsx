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
import { useHeading } from './hook';
import type { HeadingProps } from './types';

function UnconnectedHeading(
	props: FinPressComponentProps< HeadingProps, 'h1' >,
	forwardedRef: ForwardedRef< any >
) {
	const headerProps = useHeading( props );

	return <View { ...headerProps } ref={ forwardedRef } />;
}

/**
 * `Heading` renders headings and titles using the library's typography system.
 *
 * ```jsx
 * import { __experimentalHeading as Heading } from "@finpress/components";
 *
 * function Example() {
 *   return <Heading>Code is Poetry</Heading>;
 * }
 * ```
 */
export const Heading = contextConnect( UnconnectedHeading, 'Heading' );

export default Heading;
