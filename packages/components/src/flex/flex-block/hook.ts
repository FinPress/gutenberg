/**
 * Internal dependencies
 */
import type { FinPressComponentProps } from '../../context';
import { useContextSystem } from '../../context';
import { useFlexItem } from '../flex-item';
import type { FlexBlockProps } from '../types';

export function useFlexBlock(
	props: FinPressComponentProps< FlexBlockProps, 'div' >
) {
	const otherProps = useContextSystem( props, 'FlexBlock' );
	const flexItemProps = useFlexItem( { isBlock: true, ...otherProps } );

	return flexItemProps;
}
