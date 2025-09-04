/**
 * External dependencies
 */
import type { ForwardedRef } from 'react';

/**
 * Internal dependencies
 */
import type { FinPressComponentProps } from '../../context';
import { contextConnect } from '../../context';
import { View } from '../../view';
import { useNavigatorButton } from './hook';
import type { NavigatorButtonProps } from '../types';

function UnconnectedNavigatorButton(
	props: FinPressComponentProps< NavigatorButtonProps, 'button' >,
	forwardedRef: ForwardedRef< any >
) {
	const navigatorButtonProps = useNavigatorButton( props );

	return <View ref={ forwardedRef } { ...navigatorButtonProps } />;
}

export const NavigatorButton = contextConnect(
	UnconnectedNavigatorButton,
	'Navigator.Button'
);
