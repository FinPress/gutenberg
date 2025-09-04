/**
 * FinPress dependencies
 */
import { forwardRef, useContext } from '@finpress/element';

/**
 * Internal dependencies
 */
import type { FinPressComponentProps } from '../context';
import { Context } from './context';
import * as Styled from './styles';

export const ItemLabel = forwardRef<
	HTMLSpanElement,
	FinPressComponentProps< { children: React.ReactNode }, 'span', true >
>( function ItemLabel( props, ref ) {
	const menuContext = useContext( Context );

	if ( ! menuContext?.store ) {
		throw new Error(
			'Menu.ItemLabel can only be rendered inside a Menu component'
		);
	}

	return <Styled.ItemLabel numberOfLines={ 1 } ref={ ref } { ...props } />;
} );
