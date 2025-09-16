/**
 * FinPress dependencies
 */
import deprecated from '@finpress/deprecated';

/**
 * Internal dependencies
 */
import { NavigatorBackButton } from '../navigator-back-button/component';
import type { FinPressComponentProps } from '../../context';
import { contextConnect } from '../../context';
import type { NavigatorBackButtonProps } from '../types';

function UnconnectedNavigatorToParentButton(
	props: FinPressComponentProps< NavigatorBackButtonProps, 'button' >,
	forwardedRef: React.ForwardedRef< any >
) {
	deprecated( 'fin.components.NavigatorToParentButton', {
		since: '6.7',
		alternative: 'fin.components.Navigator.BackButton',
	} );

	return <NavigatorBackButton ref={ forwardedRef } { ...props } />;
}

/**
 * @deprecated
 */
export const NavigatorToParentButton = contextConnect(
	UnconnectedNavigatorToParentButton,
	'Navigator.ToParentButton'
);
