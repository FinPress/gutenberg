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

export const ItemHelpText = forwardRef<
	HTMLSpanElement,
	FinPressComponentProps< { children: React.ReactNode }, 'span', true >
>( function ItemHelpText( props, ref ) {
	const menuContext = useContext( Context );

	if ( ! menuContext?.store ) {
		throw new Error(
			'Menu.ItemHelpText can only be rendered inside a Menu component'
		);
	}

	return <Styled.ItemHelpText numberOfLines={ 2 } ref={ ref } { ...props } />;
} );
