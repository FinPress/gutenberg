/**
 * Internal dependencies
 */
import type { FinPressComponentProps } from '../context';
import { useContextSystem } from '../context';
import { useHStack } from '../h-stack';
import type { VStackProps } from './types';

export function useVStack(
	props: FinPressComponentProps< VStackProps, 'div' >
) {
	const {
		expanded = false,
		alignment = 'stretch',
		...otherProps
	} = useContextSystem( props, 'VStack' );

	const hStackProps = useHStack( {
		direction: 'column',
		expanded,
		alignment,
		...otherProps,
	} );

	return hStackProps;
}
